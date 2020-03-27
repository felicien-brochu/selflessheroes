import map from './map401.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level401-messages-${language}.json`)
}

const winCondition = {
  beforeStart() {
    const map = this.world.map
    this.floor = []
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        if (map.isFloor(x, y)) {
          this.floor.push([x, y])
        }
      }
    }
  },

  check() {
    return this.floor.every(cell => cell[0] % 2 !== cell[1] % 2 || this.world.getCharactersAt(cell[0], cell[1]).length > 0)
  }
}

const wrongFloorCellCondition = {
  beforeStart() {
    const map = this.world.map
    this.wrongFloor = []
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        if (map.isFloor(x, y) && x % 2 !== y % 2) {
          this.wrongFloor.push([x, y])
        }
      }
    }
  },

  check() {
    return this.wrongFloor.some(cell => this.world.getCharactersAt(cell[0], cell[1]).length > 0)
  },

  getReason() {
    return 'loss_reason_wrong_floor_cell'
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 100,
  speedTarget: 17,
  lengthTarget: 7,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['jump'],
    terrainTypes: ['floor', 'hole'],
    objectTypes: ['hero', 'nothing'],
    actionFunctions: [],
    valueFunctions: [],
    variables: 0,
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: [winCondition],
    lose: [wrongFloorCellCondition, 'or', 'one_hero_dead', 'or', 'default_loss']
  },
}

export default level