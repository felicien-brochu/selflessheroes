import Map from './Map'
import Hero from './Hero'
import Objective from './Objective'
import RuleSet from './rules/RuleSet'

export default class World {
  constructor(config, aiFactory) {
    this.config = config
    this.aiFactory = aiFactory

    this.map = new Map(config)
    this.characters = []
    this.heros = []
    this.objectives = []
    this.parseObjects()

    this.hasWon = false
    this.hasLost = false
    this.gameOver = false
    this.steps = 0
  }

  parseObjects() {
    let objectsLayer = null,
      rulesLayer = null
    for (let layer of this.config.layers) {
      if (layer.name === 'objects') {
        objectsLayer = layer
      } else if (layer.name === 'rules') {
        rulesLayer = layer
      }
    }

    if (!objectsLayer) {
      throw new Error("objects layer is missing from the map object: " + JSON.stringify(this.config))
    }
    if (!rulesLayer) {
      throw new Error("rules layer is missing from the map object: " + JSON.stringify(this.config))
    }
    let ruleSet = rulesLayer.objects[0]
    if (!ruleSet || ruleSet.type !== 'ruleSet') {
      throw new Error("ruleSet object is missing from the map object: " + JSON.stringify(this.config))
    }

    this.ruleSet = RuleSet.build(ruleSet, this)

    for (var i = 0; i < objectsLayer.objects.length; i++) {
      this.createObject(objectsLayer.objects[i], this.config.tilewidth, this.config.tileheight)
    }
  }


  createObject(config, tileWidth, tileHeight) {
    switch (config.type) {
      case 'hero':
        let hero = new Hero(config, this.aiFactory, tileWidth, tileHeight, this)
        this.heros.push(hero)
        this.characters.push(hero)
        break;
      case 'objective':
        this.objectives.push(new Objective(config, tileWidth, tileHeight))
        break;
    }
  }

  step() {
    this.steps++
    try {
      for (var i = 0; i < this.heros.length; i++) {
        let hero = this.heros[i]
        let action = hero.step()
        if (action) {
          if (action.type === 'StepAction' && !this.collideWall(hero, action.direction)) {
            hero.move(action.direction)

            for (let objective of this.objectives) {
              if (hero.overlaps(objective)) {
                objective.enable()
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(e)
      this.pause()
    }

    if (this.ruleSet.checkWinCondition()) {
      this.declareWin()
    } else if (this.ruleSet.checkLossCondition()) {
      this.declareLoss()
    }
  }

  collideWall(character, direction) {
    return this.map.isWall(character.x + direction.dx, character.y + direction.dy)
  }

  getWorldObjectsAt(x, y) {
    return this.getWorldObjects().filter(o => o.x === x && o.y === y)
  }

  getWorldObjects() {
    return [].concat(this.heros).concat(this.objectives)
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
}