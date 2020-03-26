import map from './map406.json'
const messages = {}
for (let language of SUPPORTED_LANGUAGES) {
  messages[language] = require(`./level406-messages-${language}.json`)
}

function findTargetEgg(world) {
  return world.eggs.find(egg => egg.id === 164)
}

function calculateSum(world) {
  return world.eggs.reduce((sum, egg) => sum + egg.value, 0)
}

const winCondition = {
  beforeStart() {
    this.sum = calculateSum(this.world)
    this.targetEgg = findTargetEgg(this.world)
  },

  check() {
    return (
      this.targetEgg.value === this.sum &&
      !this.targetEgg.owner &&
      this.targetEgg.x === 2 && this.targetEgg.y === 2
    )
  }
}

const wrongSumOnEggCondition = {
  beforeStart() {
    this.sum = calculateSum(this.world)
    this.targetEgg = findTargetEgg(this.world)
  },

  check() {
    return this.targetEgg.value !== 0 && this.targetEgg.value !== this.sum
  },

  getReason() {
    return 'loss_reason_wrong_sum_on_egg'
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 200,
  speedTarget: 26,
  lengthTarget: 8,

  compilerConfig: {
    excludePrimary: [],
    cloneIsDeadly: false,
    terrainTypes: ['floor', 'wall', 'hole'],
    objectTypes: ['hero', 'egg', 'nothing'],
    actionFunctions: ['take', 'drop', 'write'],
    valueFunctions: ['set', 'calc'],
    variables: 1,
    leftComparisonExpressions: ['direction', 'myitem', 'variable'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'myitem', 'integer', 'variable']
  },

  ruleset: {
    win: [winCondition],
    lose: [wrongSumOnEggCondition, 'or', 'default_loss']
  },
}

export default level