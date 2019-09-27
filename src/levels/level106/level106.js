import map from './map106.json'

const winCondition = {
  beforeStart() {
    this.maxEggValue = this.world.eggs.reduce((accumulator, egg) => Math.max(egg.value, accumulator), 0)
  },

  check() {
    const cauldronID = 30
    let cauldron = this.world.findWorldObjectByID(cauldronID)
    return cauldron.items.length === 1 && cauldron.items[0].value === this.maxEggValue
  }
}

const notMaximumEggLossCondition = {
  beforeStart() {
    this.maxEggValue = this.world.eggs.reduce((accumulator, egg) => Math.max(egg.value, accumulator), 0)
  },

  check() {
    const cauldronID = 30
    let cauldron = this.world.findWorldObjectByID(cauldronID)
    return cauldron.items.length > 0 && cauldron.items[0].value < this.maxEggValue
  },

  getReason() {
    return 'loss_reason_not_maximum_egg_in_cauldron'
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Human chain 2",
    fr: "Chaîne humaine 2",
  },
  objective: {
    en: "Put the %%icon icon-egg$%% egg of maximum value\ninto the %%icon icon-cauldron$%% cauldron\n\n%%icon mdi mdi-information-outline$%% In case of a tie, choose one of the two",
    fr: "Mets l'%%icon icon-egg$%% œuf de valeur maximum\ndans le %%icon icon-cauldron$%% chaudron\n\n%%icon mdi mdi-information-outline$%% En cas d'égalité, choisis l'un des deux",
  },
  messages: {
    loss_reason_not_maximum_egg_in_cauldron: {
      en: "You put an %%icon icon-egg$%% egg which is not the maximum into the %%icon icon-cauldron$%% cauldron",
      fr: "Tu as mis un %%icon icon-egg$%% œuf qui n'est pas le maximum dans le %%icon icon-cauldron$%% chaudron",
    }
  },

  maxStep: 150,
  speedTarget: 23,
  lengthTarget: 6,

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
    lose: [notMaximumEggLossCondition, 'or', 'default_loss']
  }
}

export default level