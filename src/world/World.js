import Map from './Map'
import Hero from './Hero'
import Npc from './Npc'
import CharacterDeathReason from './CharacterDeathReason'
import Switch from './Switch'
import Bonfire from './Bonfire'
import Spikes from './Spikes'
import Item from './Item'
import Egg from './Egg'
import AIConfig from './AIConfig'
import PathConfig from './PathConfig'
import EventLog from './EventLog'
import NpcAIFactory from './ai/NpcAIFactory'
import IdleAI from './ai/IdleAI'
import {
  namedObjectListToObject
} from './utils'

export default class World {
  constructor(level, mapConfig, aiFactory, rng) {
    this.level = level
    this.mapConfig = mapConfig
    this.aiFactory = aiFactory
    this.rng = rng

    this.map = new Map(mapConfig)
    this.characters = []
    this.heroes = []
    this.npcs = []
    this.switches = []
    this.bonfires = []
    this.spikes = []
    this.eggs = []

    this.configObjects = []
    this.parseObjects()

    this.ruleset = this.level.buildRuleset(this)
    this.hasWon = false
    this.hasLost = false
    this.gameOver = false
    this.steps = 0

    this.eventLog = new EventLog(this)
    this.eventLog.attach()
  }

  parseObjects() {
    let layers = namedObjectListToObject(this.mapConfig.layers)

    if (!layers.objects) {
      throw new Error("objects layer is missing from the map object: " + JSON.stringify(this.mapConfig))
    }

    for (var i = 0; i < layers.objects.objects.length; i++) {
      this.createObject(layers.objects.objects[i], this.mapConfig.tilewidth, this.mapConfig.tileheight)
    }

    // Item ownership + hero AIs
    for (let hero of this.heroes) {
      if (this.aiFactory) {
        hero.ai = this.aiFactory.buildAI(this, hero)
      }

      if (Number.isInteger(hero.item)) {
        let item = this.findWorldObjectByID(hero.item)
        hero.takeItem(item)
      }
    }

    // NPCs AIs
    for (let npc of this.npcs) {
      npc.ai = NpcAIFactory.buildAI(this, npc)
    }

    // Init spikes triggers
    for (let spikes of this.spikes) {
      spikes.initTriggers(this)
    }

    // Generate eggs values with rng if necessary
    for (let egg of this.eggs) {
      egg.initValue(this.rng)
    }
  }


  createObject(config, tileWidth, tileHeight) {
    switch (config.type) {
      case 'hero':
        let hero = new Hero(config, tileWidth, tileHeight, this)
        this.heroes.push(hero)
        this.characters.push(hero)
        break
      case 'npc':
        let npc = new Npc(config, tileWidth, tileHeight, this)
        this.npcs.push(npc)
        this.characters.push(npc)
        break
      case 'switch':
        this.switches.push(new Switch(config, tileWidth, tileHeight))
        break
      case 'bonfire':
        this.bonfires.push(new Bonfire(config, tileWidth, tileHeight))
        break
      case 'spikes':
        this.spikes.push(new Spikes(config, tileWidth, tileHeight))
        break
      case 'egg':
        this.eggs.push(new Egg(config, tileWidth, tileHeight))
        break
      case 'ai':
        this.configObjects.push(new AIConfig(config, tileWidth, tileHeight))
        break
      case 'path':
        this.configObjects.push(new PathConfig(config, tileWidth, tileHeight))
        break
    }
  }

  step() {
    this.steps++
    try {
      let characterActions = []
      for (let hero of this.heroes) {
        let action = hero.step(this.rng)

        characterActions.push({
          character: hero,
          action: action
        })
      }

      for (let npc of this.npcs) {
        let action = npc.step(this.rng)

        characterActions.push({
          character: npc,
          action: action
        })
      }

      this.resolveCharacterActions(characterActions)
      this.resolveActionConsequences(characterActions)
    } catch (e) {
      console.error(e)
      this.pause()
    }

    this.ruleset.step()
    if (this.ruleset.hasLost()) {
      this.declareLoss()
    } else if (this.ruleset.hasWon()) {
      this.declareWin()
    }
  }

  resolveCharacterActions(characterActions) {
    this.resolveStepActions(characterActions)
    this.resolveDropActions(characterActions)
    this.resolveTakeActions(characterActions)
    this.resolveWriteActions(characterActions)
    this.resolveFireBallActions(characterActions)
  }

  resolveDropActions(characterActions) {
    for (let {
        character,
        action
      } of characterActions) {
      if (action && action.type === 'DropAction' && character.item !== null) {
        let x = character.x + action.direction.dx
        let y = character.y + action.direction.dy

        let items = this.getWorldObjectsAt(x, y).filter(o => o instanceof Item)
        if (items.length === 0 && this.map.isFloor(x, y)) {
          character.dropItem(action.direction)
        }
      }
    }
  }

  resolveTakeActions(characterActions) {
    for (let {
        character,
        action
      } of characterActions) {
      if (action && action.type === 'TakeAction' && character.item === null) {
        let x = character.x + action.direction.dx
        let y = character.y + action.direction.dy

        let items = this.getWorldObjectsAt(x, y).filter(o => o instanceof Item)
        if (items.length > 0) {
          character.takeItem(items[0])
        }
      }
    }
  }

  resolveWriteActions(characterActions) {
    for (let {
        character,
        action
      } of characterActions) {
      if (action && action.type === 'WriteAction' && character.item !== null && typeof character.item.write === 'function') {
        character.item.write(action.value)
      }
    }
  }

  resolveFireBallActions(characterActions) {
    for (let {
        character,
        action
      } of characterActions) {
      if (action && action.type === 'FireBallAction') {
        let x = character.x + action.direction.dx
        let y = character.y + action.direction.dy

        // Light bonfires
        let bonfires = this.bonfires.filter(b => b.x === x && b.y === y)
        bonfires.forEach(bonfire => bonfire.enable())

        // Kill heroes
        let targetHeroes = this.heroes.filter(h => h.x === x && h.y === y)
        targetHeroes.forEach(character => character.setDead(true, CharacterDeathReason.burnt))
      }
    }
  }

  resolveStepActions(characterActions) {
    let stepActions = characterActions.filter(action => action.action && action.action.type === 'StepAction' && !action.character.dead)

    // Wall collisions and simple hero collisions
    let changed = true
    while (changed) {
      changed = false
      for (let i = 0; i < stepActions.length; i++) {
        let {
          character,
          action
        } = stepActions[i]
        let x = character.x + action.direction.dx
        let y = character.y + action.direction.dy
        let collidesWall = this.map.isWall(x, y)
        let collidesBonfire = this.getWorldObjectsAt(x, y).filter(o => o instanceof Bonfire).length > 0
        let collidingHeroes = this.getCharactersAt(x, y).filter(c => !c.dead && c instanceof Hero)
        let collidesHero = collidingHeroes.length > 0

        if (collidesWall || collidesBonfire) {
          stepActions.splice(i, 1)
          i--
        } else if (!collidesHero || character instanceof Npc) {
          character.move(action.direction)
          stepActions.splice(i, 1)
          i--
          changed = true
        }
      }
    }

    // double hero collisions: allow heroes to exchange places
    changed = true
    while (changed) {
      changed = false
      main_loop:
        for (let i = 0; i < stepActions.length - 1; i++) {
          let stepAction1 = stepActions[i]
          let x1 = stepAction1.character.x + stepAction1.action.direction.dx
          let y1 = stepAction1.character.y + stepAction1.action.direction.dy
          for (let j = i + 1; j < stepActions.length; j++) {
            let stepAction2 = stepActions[j]
            let x2 = stepAction2.character.x + stepAction2.action.direction.dx
            let y2 = stepAction2.character.y + stepAction2.action.direction.dy

            if (x1 === stepAction2.character.x &&
              y1 === stepAction2.character.y &&
              x2 === stepAction1.character.x &&
              y2 === stepAction1.character.y) {
              stepAction1.character.move(stepAction1.action.direction)
              stepAction2.character.move(stepAction2.action.direction)
              stepActions.splice(stepActions.indexOf(stepAction1), 1)
              stepActions.splice(stepActions.indexOf(stepAction2), 1)
              changed = true
              break main_loop
            }
          }
        }
    }
  }

  resolveActionConsequences(characterActions) {
    for (let mySwitch of this.switches) {
      if (this.characters.some(character => character.overlaps(mySwitch) && !character.dead)) {
        mySwitch.enable()
      } else {
        mySwitch.disable()
      }
    }

    for (let spike of this.spikes) {
      spike.checkTriggers()
    }

    for (let character of this.characters.filter(c => !c.dead)) {
      let spikes = this.getWorldObjectsAt(character.x, character.y).filter(o => o instanceof Spikes)
      if (spikes.length > 0 && spikes[0].isEnabled()) {
        character.setDead(true, CharacterDeathReason.spikes)
      }
    }

    for (let character of this.characters.filter(c => !c.dead)) {
      if (this.map.isHole(character.x, character.y)) {
        character.setDead(true, CharacterDeathReason.fall)
      }
    }

    for (let hero of this.heroes) {
      if (this.npcs.some(npc => !npc.dead && npc.x === hero.x && npc.y === hero.y)) {
        hero.setDead(true, CharacterDeathReason.touchedEnemy)
      }
    }
  }

  getWorldObjectsAt(x, y) {
    return this.getWorldObjects().filter(o => o.x === x && o.y === y && !(o instanceof Item && o.owner))
  }

  getCharactersAt(x, y) {
    return this.getCharacters().filter(c => c.x === x && c.y === y)
  }

  getWorldObjects() {
    return [
      ...this.heroes,
      ...this.npcs,
      ...this.switches,
      ...this.bonfires,
      ...this.spikes,
      ...this.eggs
    ]
  }

  findWorldObjectByID(id) {
    return this.getWorldObjects().find(o => o.id === id)
  }

  findConfigObjectByID(id) {
    return this.configObjects.find(o => o.id === id)
  }

  getCharacters() {
    return this.characters
  }

  declareWin() {
    this.hasWon = true
    this.declareGameOver()
  }

  declareLoss() {
    this.hasLost = true
    this.declareGameOver()
  }

  declareGameOver() {
    this.gameOver = true
  }

  getDebugContext() {
    let context = {
      heroes: this.heroes.map(hero => hero.getDebugContext()),
      eventLog: this.eventLog
    }
    return context
  }
}