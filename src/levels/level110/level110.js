import map from './map110.json'

const winCondition = {
  beforeStart() {
    this.maxEggValue = this.world.eggs.reduce((max, egg) => Math.max(egg.value, max), 0)
  },

  check() {
    let cauldron = this.world.cauldrons[0]
    return cauldron.items.length === 1 && cauldron.items[0].value === this.maxEggValue
  },
}

const wrongEggLossCondition = {
  beforeStart() {
    this.maxEggValue = this.world.eggs.reduce((max, egg) => Math.max(egg.value, max), 0)
  },

  check() {
    let cauldron = this.world.cauldrons[0]
    return cauldron.items.length === 1 && cauldron.items[0].value !== this.maxEggValue || cauldron.items.length > 1
  },

  getReason() {
    return 'loss_reason_one_egg_not_max'
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Human chain 3",
    fr: "Chaîne humaine 3",
  },
  objective: {
    en: "Put the maximum %%icon icon-egg$%% egg into the %%icon icon-cauldron$%% cauldron",
    fr: "Mets l'%%icon icon-egg$%% œuf maximum dans le %%icon icon-cauldron$%% chaudron",
  },
  messages: {
    loss_reason_one_egg_not_max: {
      en: "You put an %%icon icon-egg$%% egg which is not the maximum into the %%icon icon-cauldron$%% cauldron",
      fr: "Tu as mis un %%icon icon-egg$%% œuf qui n'est pas le maximum dans le %%icon icon-cauldron$%% chaudron",
    }
  },

  maxStep: 200,
  speedTarget: 24,
  lengthTarget: 7,

  compilerConfig: {
    excludePrimary: ['assign'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg', 'cauldron', 'nothing'],
    actionFunctions: ['take', 'drop'],
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['direction', 'object_type', 'terrain_type', 'myitem']
  },

  ruleset: {
    win: [winCondition],
    lose: [wrongEggLossCondition, 'or', 'default_loss']
  }
}

export default level