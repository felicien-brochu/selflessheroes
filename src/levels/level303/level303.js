import map from './map303.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level303-messages-${language}.json`)
}

const winCondition = {
  beforeStart(world) {
    const map = world.map
    this.floor = []
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        if (map.isFloor(x, y)) {
          this.floor.push([x, y])
        }
      }
    }
  },

  check(world) {
    return this.floor.every(cell => cell[0] % 2 !== cell[1] % 2 || world.getCharactersAt(cell[0], cell[1]).length > 0)
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 100,
  speedTarget: 8,
  lengthTarget: 5,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['clone', 'jump', 'anchor'],
    terrainTypes: ['floor', 'wall'],
    objectTypes: [],
    actionFunctions: ['step', 'tell', 'listen'],
    valueFunctions: [],
    variables: 0,
    messages: 8,
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['terrain_type'],
    forbiddenExpressions: ['everyone']
  },

  ruleset: {
    win: winCondition,
    lose: ['default_loss']
  },
}

export default level