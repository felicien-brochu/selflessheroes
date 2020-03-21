import map from './map310.json'
import enMessages from './level310-messages-en.json'
import frMessages from './level310-messages-fr.json'

const winCondition = {
  beforeStart() {
    this.targetValues = this.world.eggs
      .filter(egg => egg.y === 6)
      .sort((a, b) => a.x - b.x)
      .map(egg => egg.shallowCopy())
  },

  check() {
    return this.world.eggs
      .filter(egg => egg.y < 4)
      .sort((a, b) => a.x - b.x)
      .every((egg, index) => this.targetValues[index].value === egg.value)
  },
}

const level = {
  mapConfig: map,
  messages: {
    en: enMessages,
    fr: frMessages
  },

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