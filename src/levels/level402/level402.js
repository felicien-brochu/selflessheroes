import map from './map402.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level402-messages-${language}.json`)
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

const tooMuchHeroesCondition = {
  check(world) {
    return world.heroes.length > 10
  },

  getReason(world) {
    return 'loss_reason_too_mush_heroes'
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 200,
  speedTarget: 27,
  lengthTarget: 6,
  deterministic: true,

  compilerConfig: {
    excludePrimary: [],
    terrainTypes: ['floor', 'wall'],
    objectTypes: ['hero', 'switch', 'spikes', 'nothing'],
    actionFunctions: ['step_once'],
    valueFunctions: [],
    variables: 0,
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: ['all_switches'],
    lose: [tooMuchHeroesCondition, 'or', 'one_hero_dead', 'or', 'default_loss']
  },
}

export default level