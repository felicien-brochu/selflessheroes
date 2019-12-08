import map from './map407.json'

function maxValue(world) {
  return world.eggs.reduce((max, egg) => Math.max(max, egg.value), 0)
}

const winCondition = {
  beforeStart() {
    this.maxValue = maxValue(this.world)
  },

  check() {
    let cauldronContent = this.world.cauldrons[0].items
    return cauldronContent.length >= 1 && cauldronContent.every(egg => egg.value === this.maxValue)
  }
}

const wrongEggInCauldronCondition = {
  beforeStart() {
    this.maxValue = maxValue(this.world)
  },

  check() {
    let cauldronContent = this.world.cauldrons[0].items
    return cauldronContent.some(egg => egg.value !== this.maxValue)
  },

  getReason() {
    return 'loss_reason_wrong_egg_in_cauldron'
  }
}

const tooMuchHeroesCondition = {
  check() {
    return this.world.heroes.length > 31
  },

  getReason() {
    return 'loss_reason_too_mush_heroes'
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Egg tree",
    fr: "Pommier",
  },
  objective: {
    en: "Put the %%icon icon-egg$%% egg of maximum value into the %%icon icon-cauldron$%% cauldron.\n\n%%icon mdi mdi-alert-octagon-outline$%%Maximum number of heroes: 31",
    fr: "Mets l' %%icon icon-egg$%% œuf de valeur maximum dans le %%icon icon-cauldron$%% chaudron.\n\n%%icon mdi mdi-alert-octagon-outline$%%Nombre maximum de héros\u00A0: 31",
  },

  messages: {
    loss_reason_wrong_egg_in_cauldron: {
      en: "A hero put an %%icon icon-egg$%% egg which is not of maximum value in the cauldron",
      fr: "Un héro a mis un %%icon icon-egg$%% œuf qui n'est pas le maximum dans le chaudron"
    },
    loss_reason_too_mush_heroes: {
      en: "The maximum number of heroes has been exceeded.\nMaximum number of heroes: 31",
      fr: "Le nombre maximum de héros a été dépassé.\nNombre de héros maximum\u00A0: 31"
    },
  },

  maxStep: 600,
  speedTarget: 140,
  lengthTarget: 34,

  compilerConfig: {
    excludePrimary: [],
    cloneIsDeadly: false,
    terrainTypes: ['floor', 'wall', 'hole'],
    objectTypes: ['hero', 'egg', 'cauldron', 'nothing'],
    actionFunctions: ['step_once', 'take', 'drop'],
    valueFunctions: [],
    variables: 0,
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['direction', 'object_type', 'terrain_type', 'myitem']
  },

  ruleset: {
    win: [winCondition],
    lose: [tooMuchHeroesCondition, 'or', wrongEggInCauldronCondition, 'or', 'default_loss']
  },
}

export default level