import map from './map311.json'

function computeNumber(world) {
  let startValues = world.eggs
    .sort((a, b) => b.x - a.x)
    .map(egg => egg.value)

  return startValues.reduce((acc, value, index) => acc + value * (10 ** index), 0)
}

const winCondition = {
  beforeStart() {
    this.targetNumber = computeNumber(this.world) * 2
  },

  check() {
    let eggs = this.world.eggs.sort((a, b) => b.x - a.x)

    return eggs.every(egg => !egg.owner && egg.y === 5) &&
      eggs[0].x === 9 && eggs[eggs.length - 1].x === 4 &&
      computeNumber(this.world) === this.targetNumber
  },
}


const wrongNumberLossCondition = {
  beforeStart() {
    this.targetNumber = computeNumber(this.world) * 2
  },

  check() {
    let eggs = this.world.eggs.sort((a, b) => b.x - a.x)

    return eggs.every(egg => !egg.owner && egg.y === 5) &&
      eggs[0].x === 9 && eggs[eggs.length - 1].x === 4 &&
      computeNumber(this.world) !== this.targetNumber
  },

  getReason() {
    return 'loss_reason_wrong_number'
  }
}

const notSameTimeLossCondition = {
  check() {
    let eggsOnCross = this.world.eggs.filter(egg => !egg.owner && egg.y === 5 && egg.x >= 4 && egg.x <= 9)
    return eggsOnCross.length > 0 && eggsOnCross.length < 6
  },

  getReason() {
    return 'loss_reason_not_same_time'
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Multipliers",
    fr: "Multiplicateurs",
  },
  objective: {
    en: "Multiply by 2 the 6-digit number formed by the %%icon icon-egg$%% eggs and write the result on the %%icon icon-egg$%% eggs in the same way (1 digit by egg). Then drop all %%icon icon-egg$%% eggs at the same time between the two %%icon icon-bonfire$%% bonfires.",
    fr: "Multiplie par 2 le nombre à 6 chiffres formé par les %%icon icon-egg$%% œufs et écris le résultat sur les %%icon icon-egg$%% œufs de la même manière (1 chiffre par œuf). Ensuite dépose tous les %%icon icon-egg$%% œufs en même temps entre les deux %%icon icon-bonfire$%% feux.",
  },
  messages: {
    loss_reason_wrong_number: {
      en: "There is an error in the calculation",
      fr: "Il y a une erreur dans le calcul",
    },
    loss_reason_not_same_time: {
      en: "Heroes must drop all %%icon icon-egg$%% eggs at the same time between the two %%icon icon-bonfire$%% bonfires.",
      fr: "Les héros doivent déposer tous les %%icon icon-egg$%% œufs en même temps entre les deux %%icon icon-bonfire$%% feux.",
    },
  },

  maxStep: 140,
  speedTarget: 9,
  lengthTarget: 11,

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['floor', 'wall'],
    objectTypes: ['egg', 'hero', 'bonfire', 'nothing'],
    actionFunctions: ['step_once', 'take', 'drop', 'write', 'tell', 'listen'],
    valueFunctions: ['set', 'calc'],
    variables: 2,
    messages: 8,
    leftComparisonExpressions: ['direction', 'myitem', 'variable'],
    rightComparisonExpressions: ['direction', 'terrain_type', 'object_type', 'integer'],
  },

  ruleset: {
    win: [winCondition],
    lose: [notSameTimeLossCondition, 'or', wrongNumberLossCondition, 'or', 'default_loss']
  },
}

export default level