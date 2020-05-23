import map from './map110.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level110-messages-${language}.json`)
}

const winCondition = {
  beforeStart(world) {
    this.maxEggValue = world.eggs.reduce((max, egg) => Math.max(egg.value, max), 0)
  },

  check(world) {
    let cauldron = world.cauldrons[0]
    return cauldron.items.length === 1 && cauldron.items[0].value === this.maxEggValue
  },
}

const wrongEggLossCondition = {
  beforeStart(world) {
    this.maxEggValue = world.eggs.reduce((max, egg) => Math.max(egg.value, max), 0)
  },

  check(world) {
    let cauldron = world.cauldrons[0]
    return cauldron.items.length === 1 && cauldron.items[0].value !== this.maxEggValue || cauldron.items.length > 1
  },

  getReason(world) {
    return 'loss_reason_one_egg_not_max'
  }
}

const level = {
  mapConfig: map,
  messages: messages,

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