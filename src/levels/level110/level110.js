import map from './map110.json'
import enMessages from './level110-messages-en.json'
import frMessages from './level110-messages-fr.json'

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
  messages: {
    en: enMessages,
    fr: frMessages
  },

  maxStep: 200,
  speedTarget: 25,
  lengthTarget: 7,

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
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