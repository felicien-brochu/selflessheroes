import Map from './Map'
import Hero from './Hero'
import CharacterDeathReason from './CharacterDeathReason'
import Switch from './Switch'
import Bonfire from './Bonfire'
import {
  namedObjectListToObject
} from './utils'

export default class World {
  constructor(level, mapConfig, aiFactory) {
    this.level = level
    this.mapConfig = mapConfig
    this.aiFactory = aiFactory

    this.map = new Map(mapConfig)
    this.characters = []
    this.heroes = []
    this.switches = []
    this.bonfires = []
    this.parseObjects()

    this.ruleset = this.level.buildRuleset(this)
    this.hasWon = false
    this.hasLost = false
    this.gameOver = false
    this.steps = 0
  }

  parseObjects() {
    let layers = namedObjectListToObject(this.mapConfig.layers)

    if (!layers.objects) {
      throw new Error("objects layer is missing from the map object: " + JSON.stringify(this.mapConfig))
    }

    for (var i = 0; i < layers.objects.objects.length; i++) {
      this.createObject(layers.objects.objects[i], this.mapConfig.tilewidth, this.mapConfig.tileheight)
    }
  }


  createObject(config, tileWidth, tileHeight) {
    switch (config.type) {
      case 'hero':
        let hero = new Hero(config, this.aiFactory, tileWidth, tileHeight, this)
        this.heroes.push(hero)
        this.characters.push(hero)
        break;
      case 'switch':
        this.switches.push(new Switch(config, tileWidth, tileHeight))
        break;
      case 'bonfire':
        this.bonfires.push(new Bonfire(config, tileWidth, tileHeight))
        break;
    }
  }

  step(rng) {
    this.steps++
    try {
      let heroActions = []
      for (var i = 0; i < this.heroes.length; i++) {
        let hero = this.heroes[i]
        let action = hero.step(rng)

        heroActions.push({
          hero: hero,
          action: action
        })
      }

      this.resolveHeroActions(heroActions)
    } catch (e) {
      console.error(e)
      this.pause()
    }

    this.ruleset.step()
    if (this.ruleset.hasWon()) {
      this.declareWin()
    } else if (this.ruleset.hasLost()) {
      this.declareLoss()
    }
  }

  resolveHeroActions(heroActions) {
    this.resolveStepActions(heroActions)
    this.resolveFireBallActions(heroActions)
  }

  resolveFireBallActions(heroActions) {
    for (let {
        hero,
        action
      } of heroActions) {
      if (action && action.type === 'FireBallAction') {
        let x = hero.x + action.direction.dx
        let y = hero.y + action.direction.dy

        // Light bonfires
        let bonfires = this.bonfires.filter(b => b.x === x && b.y === y)
        bonfires.forEach(bonfire => bonfire.enable())

        // Kill heroes
        let targetHeroes = this.heroes.filter(h => h.x === x && h.y === y)
        targetHeroes.forEach(hero => hero.setDead(true, CharacterDeathReason.burnt))
      }
    }
  }

  resolveStepActions(heroActions) {
    let stepActions = heroActions.filter(heroAction => heroAction.action && heroAction.action.type === 'StepAction' && !heroAction.hero.dead)

    // Wall collisions and simple hero collisions
    let changed = true
    while (changed) {
      changed = false
      for (let i = 0; i < stepActions.length; i++) {
        let {
          hero,
          action
        } = stepActions[i]
        let x = hero.x + action.direction.dx
        let y = hero.y + action.direction.dy
        let collidesWall = this.map.isWall(x, y)
        let collidesCharacter = this.getCharactersAt(x, y).filter(c => !c.dead).length > 0
        if (collidesWall) {
          stepActions.splice(i, 1)
          i--
        } else if (!collidesCharacter) {
          hero.move(action.direction)
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
          let x1 = stepAction1.hero.x + stepAction1.action.direction.dx
          let y1 = stepAction1.hero.y + stepAction1.action.direction.dy
          for (let j = i + 1; j < stepActions.length; j++) {
            let stepAction2 = stepActions[j]
            let x2 = stepAction2.hero.x + stepAction2.action.direction.dx
            let y2 = stepAction2.hero.y + stepAction2.action.direction.dy

            if (x1 === stepAction2.hero.x &&
              y1 === stepAction2.hero.y &&
              x2 === stepAction1.hero.x &&
              y2 === stepAction1.hero.y) {
              stepAction1.hero.move(stepAction1.action.direction)
              stepAction2.hero.move(stepAction2.action.direction)
              stepActions.splice(stepActions.indexOf(stepAction1), 1)
              stepActions.splice(stepActions.indexOf(stepAction2), 1)
              changed = true
              break main_loop
            }
          }
        }
    }

    for (let mySwitch of this.switches) {
      if (this.heroes.some(hero => hero.overlaps(mySwitch) && !hero.dead)) {
        mySwitch.enable()
      } else {
        mySwitch.disable()
      }
    }

    for (let hero of this.heroes.filter(h => !h.dead)) {
      if (this.map.isHole(hero.x, hero.y)) {
        hero.setDead(true, CharacterDeathReason.fall)
      }
    }
  }

  getWorldObjectsAt(x, y) {
    return this.getWorldObjects().filter(o => o.x === x && o.y === y)
  }

  getCharactersAt(x, y) {
    return this.getCharacters().filter(c => c.x === x && c.y === y)
  }

  getWorldObjects() {
    return [
      ...this.heroes,
      ...this.switches,
      ...this.bonfires
    ]
  }

  getCharacters() {
    return this.heroes
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
      heroes: this.heroes.map(hero => hero.getDebugContext())
    }
    return context
  }
}