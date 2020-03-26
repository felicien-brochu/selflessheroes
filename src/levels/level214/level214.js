import map from './map214.json'
const messages = {}
for (let language of SUPPORTED_LANGUAGES) {
  messages[language] = require(`./level214-messages-${language}.json`)
}

const winCondition = {
  beforeStart() {
    this.droppedEggs = []
  },

  check() {
    let cauldronEggs = this.world.cauldrons[0].items
    if (cauldronEggs.length - this.droppedEggs > 1) {
      return false
    } else if (cauldronEggs.length - this.droppedEggs.length === 1) {
      let egg = cauldronEggs[cauldronEggs.length - 1]
      if (egg.value - 1 > this.droppedEggs.reduce((acc, egg) => Math.max(acc, egg.value), -1)) {
        return false
      }
    }
    this.droppedEggs = cauldronEggs.slice()
    return cauldronEggs.length >= this.world.eggs.length
  }
}

const wrongEggOrderCondition = {
  beforeStart() {
    this.droppedEggs = []
  },

  check() {
    let cauldronEggs = this.world.cauldrons[0].items
    if (cauldronEggs.length - this.droppedEggs.length > 1) {
      return true
    } else if (cauldronEggs.length - this.droppedEggs.length === 1) {
      let egg = cauldronEggs[cauldronEggs.length - 1]
      if (egg.value - 1 > this.droppedEggs.reduce((acc, egg) => Math.max(acc, egg.value), -1)) {
        return true
      }
    }
    this.droppedEggs = cauldronEggs.slice()
    return false
  },

  getReason() {
    return 'loss_reason_wrong_egg_order'
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 200,
  speedTarget: 48,
  lengthTarget: 8,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['floor', 'hole'],
    objectTypes: ['cauldron', 'egg', 'hero', 'nothing'],
    actionFunctions: ['take', 'drop', 'step_once'],
    valueFunctions: ['set', 'calc', 'nearest'],
    variables: 3,
    leftComparisonExpressions: ['direction', 'variable', 'myitem'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'variable', 'integer', 'myitem']
  },

  ruleset: {
    win: [winCondition],
    lose: [wrongEggOrderCondition, 'or', 'default_loss']
  },
}

export default level