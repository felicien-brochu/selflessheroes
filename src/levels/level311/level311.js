import map from './map311.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level311-messages-${language}.json`)
}

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
  messages: messages,

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