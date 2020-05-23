import map from './map102.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level102-messages-${language}.json`)
}

const winCondition = {
  check(world) {
    const cauldronIDs = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109]
    for (let id of cauldronIDs) {
      let cauldron = world.findWorldObjectByID(id)
      if (!cauldron || cauldron.items.length < 1) {
        return false
      }
    }
    return true
  }
}

const multipleEggsInCauldronLossCondition = {
  check(world) {
    const cauldronIDs = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109]
    for (let id of cauldronIDs) {
      let cauldron = world.findWorldObjectByID(id)
      if (cauldron && cauldron.items.length > 1) {
        return true
      }
    }
    return false
  },

  getReason(world) {
    return 'loss_reason_multiple_eggs_in_cauldron'
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 400,
  speedTarget: 29,
  lengthTarget: 4,

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg', 'cauldron', 'nothing'],
    actionFunctions: ['step_once', 'take', 'drop'],
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: winCondition,
    lose: [multipleEggsInCauldronLossCondition, 'or', 'default_loss']
  },

  worldGenerator: {
    type: 'eggs_matrix',
    config: {
      originMarkerID: 99,
      width: 10,
      height: 8,

      strategy: {
        type: 'random_columns',
        minEggs: 1,
        maxEggs: 1,
        eggConfig: {
          value: 'rng(0,9)'
        }
      }
    }
  }
}

export default level