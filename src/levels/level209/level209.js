import map from './map209.json'

const winCondition = {
  beforeStart() {
    let eggsOriginMarker = this.world.findConfigObjectByID(120)
    this.targets = []

    for (let i = 0; i < 10; i++) {
      let eggLine = this.world.eggs.filter(egg => egg.x === eggsOriginMarker.x + i)
      let avg = Math.floor(eggLine.reduce((acc, egg) => acc + egg.value, 0) / eggLine.length)

      this.targets = this.targets.concat(eggLine.map(egg => ({
        eggID: egg.id,
        avg: avg,
      })))
    }
  },

  check() {
    return this.world.eggs.every(egg => this.targets.some(target => target.eggID === egg.id && egg.value === target.avg))
  }
}

const wrongValueOnEggLossCondition = {
  beforeStart() {
    let eggsOriginMarker = this.world.findConfigObjectByID(120)
    this.targets = []

    for (let i = 0; i < 10; i++) {
      let eggLine = this.world.eggs.filter(egg => egg.x === eggsOriginMarker.x + i)
      let avg = Math.floor(eggLine.reduce((acc, egg) => acc + egg.value, 0) / eggLine.length)

      this.targets = this.targets.concat(eggLine.map(egg => ({
        eggID: egg.id,
        startValue: egg.value,
        avg: avg,
      })))
    }
  },

  check() {
    return this.world.eggs.some(egg => this.targets.some(target => target.eggID === egg.id && egg.value !== target.startValue && egg.value !== target.avg))
  },

  getReason() {
    return 'loss_reason_wrong_value_on_egg'
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Equality for all",
    fr: "Pas de jaloux",
  },
  objective: {
    en: "For each line, calculate its average value and write it on all its %%icon icon-egg$%% eggs",
    fr: "Pour chaque ligne, calcule sa moyenne et écris-la sur tous ses %%icon icon-egg$%% œufs",
  },
  messages: {
    loss_reason_wrong_value_on_egg: {
      en: "You wrote something else than the average value of its line on an %%icon icon-egg$%% egg",
      fr: "Tu as écrit quelque chose d'autre que la moyenne de sa ligne sur un %%icon icon-egg$%% œuf",
    },
  },

  maxStep: 500,
  speedTarget: 101,
  lengthTarget: 12,

  compilerConfig: {
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