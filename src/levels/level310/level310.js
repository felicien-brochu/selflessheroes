import map from './map310.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level310-messages-${language}.json`)
}

const winCondition = {
  beforeStart(world) {
    this.targetValues = world.eggs
      .filter(egg => egg.y === 6)
      .sort((a, b) => a.x - b.x)
      .map(egg => egg.shallowCopy())
    this.eggsToWrite = world.eggs
      .filter(egg => egg.y < 4)
      .sort((a, b) => a.x - b.x)
  },

  check(world) {
    return this.eggsToWrite.every((egg, index) => this.targetValues[index].value === egg.value)
  },
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 600,
  speedTarget: 143,
  lengthTarget: 16,

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['floor', 'wall', 'hole'],
    objectTypes: ['egg', 'hero', 'nothing'],
    actionFunctions: ['step_once', 'write', 'tell', 'listen'],
    valueFunctions: ['set', 'calc'],
    variables: 2,
    messages: 8,
    leftComparisonExpressions: ['direction', 'myitem', 'variable'],
    rightComparisonExpressions: ['direction', 'terrain_type', 'object_type', 'integer'],
  },

  ruleset: {
    win: [winCondition],
    lose: ['default_loss']
  },

  worldGenerator: [{
    type: 'eggs_matrix',
    config: {
      originMarkerID: 331,
      width: 8,
      height: 1,

      strategy: {
        type: 'simple',
        eggConfig: {
          value: 'rng(1,7)',
          lottery: 'rng(1,7)',
          showLottery: true
        }
      }
    }
  }]
}

export default level