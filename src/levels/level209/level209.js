import map from './map209.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level209-messages-${language}.json`)
}

const winCondition = {
  beforeStart(world) {
    let eggsOriginMarker = world.findConfigObjectByID(120)
    this.targets = []

    for (let i = 0; i < 10; i++) {
      let eggLine = world.eggs.filter(egg => egg.x === eggsOriginMarker.x + i)
      let avg = Math.floor(eggLine.reduce((acc, egg) => acc + egg.value, 0) / eggLine.length)

      this.targets = this.targets.concat(eggLine.map(egg => ({
        eggID: egg.id,
        avg: avg,
      })))
    }
  },

  check(world) {
    return world.eggs.every(egg => this.targets.some(target => target.eggID === egg.id && egg.value === target.avg))
  }
}

const wrongValueOnEggLossCondition = {
  beforeStart(world) {
    let eggsOriginMarker = world.findConfigObjectByID(120)
    this.targets = []

    for (let i = 0; i < 10; i++) {
      let eggLine = world.eggs.filter(egg => egg.x === eggsOriginMarker.x + i)
      let avg = Math.floor(eggLine.reduce((acc, egg) => acc + egg.value, 0) / eggLine.length)

      this.targets = this.targets.concat(eggLine.map(egg => ({
        eggID: egg.id,
        startValue: egg.value,
        avg: avg,
      })))
    }
  },

  check(world) {
    return world.eggs.some(egg => this.targets.some(target => target.eggID === egg.id && egg.value !== target.startValue && egg.value !== target.avg))
  },

  getReason(world) {
    return 'loss_reason_wrong_value_on_egg'
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 500,
  speedTarget: 101,
  lengthTarget: 12,

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg', 'hero', 'nothing'],
    actionFunctions: ['step', 'take', 'drop', 'write'],
    valueFunctions: ['set', 'calc'],
    variables: 2,
    leftComparisonExpressions: ['direction', 'variable', 'myitem'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'variable', 'integer', 'myitem']
  },

  ruleset: {
    win: [winCondition],
    lose: [wrongValueOnEggLossCondition, 'or', 'default_loss']
  },

  worldGenerator: [{
    type: 'eggs_matrix',
    config: {
      originMarkerID: 120,
      width: 10,
      height: 10,

      strategy: {
        type: 'random_columns',
        minEggs: 5,
        maxEggs: 10,
        eggConfig: {
          value: 'rng(0,99)',
        }
      }
    }
  }, ]
}

export default level