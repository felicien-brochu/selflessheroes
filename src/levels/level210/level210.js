import map from './map210.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level210-messages-${language}.json`)
}

const winCondition = {
  beforeStart(world) {
    this.realAvg = Math.floor(world.eggs.reduce((acc, egg) => acc + egg.value, 0) / world.eggs.length)

    let eggsOriginMarker = world.findConfigObjectByID(120)
    let avgs = []

    for (let i = 0; i < 10; i++) {
      let eggLine = world.eggs.filter(egg => egg.x === eggsOriginMarker.x + i)
      avgs.push(Math.floor(eggLine.reduce((acc, egg) => acc + egg.value, 0) / eggLine.length))
    }
    this.linesAvg = Math.floor(avgs.reduce((acc, avg) => acc + avg, 0) / 10)
  },

  check(world) {
    // It accepts the real average and the average of average of lines
    // These two values can differ a bit due to integer division
    return world.eggs.every(egg => egg.value === this.realAvg) ||
      world.eggs.every(egg => egg.value === this.linesAvg)
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 800,
  speedTarget: 177,
  lengthTarget: 27,

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg', 'hero', 'nothing'],
    actionFunctions: ['step_once', 'take', 'drop', 'write'],
    valueFunctions: ['set', 'calc'],
    variables: 2,
    leftComparisonExpressions: ['direction', 'variable', 'myitem'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'variable', 'integer', 'myitem']
  },

  ruleset: {
    win: [winCondition],
    lose: 'default_loss'
  },

  worldGenerator: [{
    type: 'eggs_matrix',
    config: {
      originMarkerID: 120,
      width: 10,
      height: 10,

      strategy: {
        type: 'simple',
        eggConfig: {
          value: 'rng(0,99)',
        }
      }
    }
  }, ]
}

export default level