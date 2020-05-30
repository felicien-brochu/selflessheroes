import map from './map202.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level202-messages-${language}.json`)
}

const winCondition = {
  beforeStart(world) {
    this.targetEggs = world.eggs.filter(egg => egg.x === 3).map(egg => egg.shallowCopy())
    this.duplicateEggs = world.eggs.filter(egg => egg.x === 9).map(egg => egg.shallowCopy())
  },

  check(world) {
    for (let targetEgg of this.targetEggs) {
      let duplicateEgg = this.duplicateEggs.find(egg => egg.y === targetEgg.y)
      let actualEgg = world.findWorldObjectByID(duplicateEgg.id)

      if (actualEgg.value !== targetEgg.value ||
        !!actualEgg.owner ||
        actualEgg.x !== duplicateEgg.x ||
        actualEgg.y !== duplicateEgg.y
      ) {
        return false
      }
    }
    return true
  }
}

const wrongValueOnEggLossCondition = {
  beforeStart(world) {
    this.targetEggs = world.eggs.filter(egg => egg.x === 3).map(egg => egg.shallowCopy())
    this.duplicateEggs = world.eggs.filter(egg => egg.x === 9).map(egg => egg.shallowCopy())
  },

  check(world) {
    for (let targetEgg of this.targetEggs) {
      let duplicateEgg = this.duplicateEggs.find(egg => egg.y === targetEgg.y)
      let actualEgg = world.findWorldObjectByID(duplicateEgg.id)
      if (actualEgg.value !== 0 &&
        actualEgg.value !== targetEgg.value) {
        return true
      }
    }
    return false
  },

  getReason(world) {
    return 'loss_reason_wrong_value_on_egg'
  }
}

const displacedTargetEggLossCondition = {
  beforeStart(world) {
    this.targetEggs = world.eggs.filter(egg => egg.x === 3)
  },

  check(world) {
    return this.targetEggs.some(egg => !!egg.owner)
  },

  getReason(world) {
    return 'loss_reason_target_egg_displaced'
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  startingCode: "$a = set(w)\n",
  maxStep: 100,
  speedTarget: 15,
  lengthTarget: 7,

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg', 'hero', 'nothing'],
    actionFunctions: ['step', 'take', 'drop', 'write'],
    valueFunctions: ['set'],
    variables: 1,
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'integer', 'myitem']
  },

  ruleset: {
    win: [winCondition],
    lose: [displacedTargetEggLossCondition, 'or', wrongValueOnEggLossCondition, 'or', 'default_loss']
  },

  worldGenerator: [{
    type: 'eggs_matrix',
    config: {
      originMarkerID: 99,
      width: 1,
      height: 5,

      strategy: {
        type: 'simple',
        eggConfig: {
          value: 0,
        }
      }
    }
  }, ]
}

export default level