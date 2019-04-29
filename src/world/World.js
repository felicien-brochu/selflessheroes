import Map from './Map'
import Hero from './Hero'
import Objective from './Objective'
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
    this.objectives = []
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
      case 'objective':
        this.objectives.push(new Objective(config, tileWidth, tileHeight))
        break;
    }
  }

  step(rng) {
    this.steps++
    try {
      for (var i = 0; i < this.heroes.length; i++) {
        let hero = this.heroes[i]
        let action = hero.step(rng)
        if (action) {
          if (action.type === 'StepAction' && !this.collides(hero, action.direction)) {
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

    this.ruleset.step()
    if (this.ruleset.hasWon()) {
      this.declareWin()
    } else if (this.ruleset.hasLost()) {
      this.declareLoss()
    }
  }

  collides(character, direction) {
    let x = character.x + direction.dx
    let y = character.y + direction.dy
    let collidesWall = this.map.isWall(x, y)
    let collidesCharacter = this.getCharactersAt(x, y).length > 0

    return collidesWall || collidesCharacter
  }

  getWorldObjectsAt(x, y) {
    return this.getWorldObjects().filter(o => o.x === x && o.y === y)
  }

  getCharactersAt(x, y) {
    return this.getCharacters().filter(c => c.x === x && c.y === y)
  }

  getWorldObjects() {
    return [].concat(this.heroes).concat(this.objectives)
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