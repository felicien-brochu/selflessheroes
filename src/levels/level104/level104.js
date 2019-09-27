import map from './map104.json'

const winCondition = {
  check() {
    const cauldronIDs = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109]
    for (let id of cauldronIDs) {
      let cauldron = this.world.findWorldObjectByID(id)
      if (!cauldron || cauldron.items.length !== 1 || cauldron.items[0].value >= 4) {
        return false
      }
    }
    return true
  }
}

const wrongEggLossCondition = {
  check() {
    const cauldronIDs = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109]
    for (let id of cauldronIDs) {
      let cauldron = this.world.findWorldObjectByID(id)
      if (cauldron && cauldron.items.length === 1 && cauldron.items[0].value >= 4) {
        return true
      }
    }
    return false
  },

  getReason() {
    return 'loss_reason_one_egg_ge_4'
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Picking",
    fr: "Cueillette",
  },
  objective: {
    en: "Put one %%icon icon-egg$%% egg which is less than 4\ninto each %%icon icon-cauldron$%% cauldron",
    fr: "Mets un %%icon icon-egg$%% œuf inférieur à 4\ndans chaque %%icon icon-cauldron$%% chaudron",
  },
  messages: {
    loss_reason_one_egg_ge_4: {
      en: "You put an %%icon icon-egg$%% egg greater or equal to 4\nin a %%icon icon-cauldron$%% cauldron",
      fr: "Tu as mis un %%icon icon-egg$%% œuf supérieur ou égal à 4\ndans un %%icon icon-cauldron$%% chaudron",
    }
  },

  maxStep: 400,
  speedTarget: 29,
  lengthTarget: 6,

  compilerConfig: {
    excludePrimary: ['assign'],
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
          showLottery: true
        }
      }
    }
  }]
}

export default level