import map from './map306.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level306-messages-${language}.json`)
}

const winCondition = {
  beforeStart(world) {
    this.leftEgg = world.findWorldObjectByID(328)
    this.rightEgg = world.findWorldObjectByID(329)
    let inventoryEggs = world.eggs.filter(egg => egg.y >= 3)
    this.inventory0 = inventoryEggs.filter(egg => egg.value === 0).length
    this.inventory1 = inventoryEggs.filter(egg => egg.value === 1).length
  },

  check(world) {
    return this.leftEgg.value === this.inventory0 && this.rightEgg.value === this.inventory1
  },
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 600,
  speedTarget: 184,
  lengthTarget: 20,

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['floor', 'wall'],
    objectTypes: ['egg', 'hero', 'nothing'],
    actionFunctions: ['step', 'write', 'tell', 'listen'],
    valueFunctions: ['set', 'calc'],
    variables: 1,
    messages: 8,
    leftComparisonExpressions: ['direction', 'myitem', 'variable'],
    rightComparisonExpressions: ['terrain_type', 'object_type', 'integer'],
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
      height: 4,

      strategy: {
        type: 'random_columns',
        minEggs: 3,
        maxEggs: 4,
        eggConfig: {
          value: 'rng(0,1)',
          showLottery: true
        }
      }
    }
  }]
}

export default level