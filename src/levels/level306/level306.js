import map from './map306.json'

const winCondition = {
  beforeStart() {
    this.leftEgg = this.world.findWorldObjectByID(328)
    this.rightEgg = this.world.findWorldObjectByID(329)
    let inventoryEggs = this.world.eggs.filter(egg => egg.y >= 3)
    this.inventory0 = inventoryEggs.filter(egg => egg.value === 0).length
    this.inventory1 = inventoryEggs.filter(egg => egg.value === 1).length
  },

  check() {
    return this.leftEgg.value === this.inventory0 && this.rightEgg.value === this.inventory1
  },
}

const level = {
  mapConfig: map,
  name: {
    en: "Inventory",
    fr: "Inventaire",
  },
  objective: {
    en: "Count the different types of %%icon icon-egg$%% eggs.\n\nWrite the number of %%icon icon-egg$%% eggs that are worth 0 on the left egg and the number of %%icon icon-egg$%% eggs that are worth 1 on the right egg.",
    fr: "Compte les différents types d'%%icon icon-egg$%% œufs.\n\nÉcris le nombre d'%%icon icon-egg$%% œufs qui valent 0 sur l'œuf de gauche et le nombre d'%%icon icon-egg$%% œufs qui valent 1 sur l'œuf de droite.",
  },

  maxStep: 600,
  speedTarget: 184,
  lengthTarget: 20,

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['floor', 'wall'],
    objectTypes: ['egg', 'hero', 'nothing'],
    actionFunctions: ['step_once', 'write', 'tell', 'listen'],
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