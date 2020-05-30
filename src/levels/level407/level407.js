import map from './map407.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level407-messages-${language}.json`)
}

function maxValue(world) {
  return world.eggs.reduce((max, egg) => Math.max(max, egg.value), 0)
}

const winCondition = {
  beforeStart(world) {
    this.maxValue = maxValue(world)
  },

  check(world) {
    let cauldronContent = world.cauldrons[0].items
    return cauldronContent.length >= 1 && cauldronContent.every(egg => egg.value === this.maxValue)
  }
}

const wrongEggInCauldronCondition = {
  beforeStart(world) {
    this.maxValue = maxValue(world)
  },

  check(world) {
    let cauldronContent = world.cauldrons[0].items
    return cauldronContent.some(egg => egg.value !== this.maxValue)
  },

  getReason(world) {
    return 'loss_reason_wrong_egg_in_cauldron'
  }
}

const tooMuchHeroesCondition = {
  check(world) {
    return world.heroes.length > 31
  },

  getReason(world) {
    return 'loss_reason_too_mush_heroes'
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 800,
  speedTarget: 140,
  lengthTarget: 34,

  compilerConfig: {
    excludePrimary: [],
    cloneIsDeadly: false,
    terrainTypes: ['floor', 'wall', 'hole'],
    objectTypes: ['hero', 'egg', 'cauldron', 'nothing'],
    actionFunctions: ['step', 'take', 'drop'],
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