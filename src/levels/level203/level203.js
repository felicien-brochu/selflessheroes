import map from './map203.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level203-messages-${language}.json`)
}

const winCondition = {
  beforeStart(world) {
    let eggsOriginMarker = world.findConfigObjectByID(99)
    this.targetEggs = world.eggs.filter(egg => egg.x === eggsOriginMarker.x).sort((a, b) => a.y - b.y).map(egg => egg.shallowCopy())
    this.startEggs = world.eggs.filter(egg => egg.x > eggsOriginMarker.x).map(egg => egg.shallowCopy())
  },

  check(world) {
    for (let targetEgg of this.targetEggs) {
      let startEggs = this.startEggs.filter(egg => egg.y === targetEgg.y)
      for (let startEgg of startEggs) {
        let actualEgg = world.findWorldObjectByID(startEgg.id)
        if (actualEgg.value !== targetEgg.value ||
          !!actualEgg.owner ||
          actualEgg.x !== startEgg.x ||
          actualEgg.y !== startEgg.y) {
          return false
        }
      }
    }
    return true
  }
}

const wrongValueOnEggLossCondition = {
  beforeStart(world) {
    let eggsOriginMarker = world.findConfigObjectByID(99)
    this.targetEggs = world.eggs.filter(egg => egg.x === eggsOriginMarker.x).sort((a, b) => a.y - b.y).map(egg => egg.shallowCopy())
    this.startEggs = world.eggs.filter(egg => egg.x > eggsOriginMarker.x).map(egg => egg.shallowCopy())
  },

  check(world) {
    let eggsOriginMarker = world.findConfigObjectByID(120)

    return world.eggs.some(egg => {
      let startEgg = this.startEggs.find(e => egg.id === e.id)
      return startEgg &&
        egg.x >= eggsOriginMarker.x &&
        egg.value !== 0 &&
        egg.value !== this.targetEggs.find(targetEgg => targetEgg.y === startEgg.y).value
    })
  },

  getReason(world) {
    return 'loss_reason_wrong_value_on_egg'
  }
}

const displacedTargetEggLossCondition = {
  beforeStart(world) {
    let eggsOriginMarker = world.findConfigObjectByID(99)
    this.targetEggs = world.eggs.filter(egg => egg.x === eggsOriginMarker.x).sort((a, b) => a.y - b.y)
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

  maxStep: 400,
  speedTarget: 50,
  lengthTarget: 7,

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['hero', 'egg', 'nothing'],
    actionFunctions: ['step_once', 'take', 'drop', 'write'],
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
      originMarkerID: 120,
      width: 6,
      height: 5,

      strategy: {
        type: 'simple',
        eggConfig: {
          value: 0,
        }
      }
    }
  }, {
    type: 'eggs_matrix',
    config: {
      originMarkerID: 99,
      width: 1,
      height: 5,

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