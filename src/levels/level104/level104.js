import map from './map104.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level104-messages-${language}.json`)
}

const winCondition = {
  check(world) {
    const cauldronIDs = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109]
    for (let id of cauldronIDs) {
      let cauldron = world.findWorldObjectByID(id)
      if (!cauldron || cauldron.items.length !== 1 || cauldron.items[0].value >= 4) {
        return false
      }
    }
    return true
  }
}

const wrongEggLossCondition = {
  check(world) {
    const cauldronIDs = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109]
    for (let id of cauldronIDs) {
      let cauldron = world.findWorldObjectByID(id)
      if (cauldron && cauldron.items.length === 1 && cauldron.items[0].value >= 4) {
        return true
      }
    }
    return false
  },

  getReason(world) {
    return 'loss_reason_one_egg_ge_4'
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 400,
  speedTarget: 29,
  lengthTarget: 5,

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg', 'cauldron', 'nothing'],
    actionFunctions: ['step_once', 'take', 'drop'],
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'integer']
  },

  ruleset: {
    win: [winCondition],
    lose: [wrongEggLossCondition, 'or', 'default_loss']
  },

  worldGenerator: [{
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
          value: 'rng(0,3)',
          lottery: 'rng(0,9)',
          showLottery: true
        }
      }
    }
  }, {
    type: 'eggs_matrix',
    config: {
      originMarkerID: 99,
      width: 10,
      height: 8,

      strategy: {
        type: 'random_columns',
        minEggs: 7,
        maxEggs: 7,
        eggConfig: {
          value: 'rng(4,9)',
          lottery: 'rng(0,9)',
          showLottery: true
        }
      }
    }
  }]
}

export default level