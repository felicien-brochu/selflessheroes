import map from './map407.json'
import enMessages from './level407-messages-en.json'
import frMessages from './level407-messages-fr.json'

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
  messages: {
    en: enMessages,
    fr: frMessages
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