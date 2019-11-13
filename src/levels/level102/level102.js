import map from './map102.json'

const winCondition = {
  check() {
    const cauldronIDs = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109]
    for (let id of cauldronIDs) {
      let cauldron = this.world.findWorldObjectByID(id)
      if (!cauldron || cauldron.items.length < 1) {
        return false
      }
    }
    return true
  }
}

const multipleEggsInCauldronLossCondition = {
  check() {
    const cauldronIDs = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109]
    for (let id of cauldronIDs) {
      let cauldron = this.world.findWorldObjectByID(id)
      if (cauldron && cauldron.items.length > 1) {
        return true
      }
    }
    return false
  },

  getReason() {
    return 'loss_reason_multiple_eggs_in_cauldron'
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Dinner's ready!",
    fr: "À table !",
  },
  objective: {
    en: "These %%icon icon-egg$%% eggs were randomly scattered throughout the room. Put one %%icon icon-egg$%% egg in each %%icon icon-cauldron$%% cauldron to prepare the dinner.",
    fr: "Ces %%icon icon-egg$%% œufs ont été éparpillés au hasard dans la pièce. Mets-en un dans chaque %%icon icon-cauldron$%% chaudron pour préparer le dîner.",
  },
  messages: {
    loss_reason_multiple_eggs_in_cauldron: {
      en: "You put multiple %%icon icon-egg$%% eggs in one %%icon icon-cauldron$%% cauldron",
      fr: "Tu as mis plusieurs %%icon icon-egg$%% œufs dans un %%icon icon-cauldron$%% chaudron",
    }
  },

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