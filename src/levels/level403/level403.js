import map from './map403.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level403-messages-${language}.json`)
}

const winCondition = {
  check(world) {
    for (let y = 0; y < world.map.height; y++) {
      for (let x = 0; x < world.map.width; x++) {
        if (world.map.isFloor(x, y)) {
          if (world.getCharactersAt(x, y).length === 0) {
            return false
          }
        }
      }
    }
    return true
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 200,
  speedTarget: 17,
  lengthTarget: 4,
  deterministic: true,

  compilerConfig: {
    excludePrimary: [],
    cloneIsDeadly: true,
    terrainTypes: ['floor', 'wall'],
    objectTypes: ['hero', 'nothing'],
    actionFunctions: [],
    valueFunctions: [],
    variables: 0,
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: [winCondition],
    lose: ['one_hero_dead', 'or', 'default_loss']
  },
}

export default level