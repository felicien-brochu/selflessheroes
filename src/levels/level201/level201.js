import map from './map201.json'
const messages = {}
for (let language of SUPPORTED_LANGUAGES) {
  messages[language] = require(`./level201-messages-${language}.json`)
}

const winCondition = {
  beforeStart() {
    this.startEggs = new Map()
    this.world.eggs.forEach(egg => this.startEggs.set(egg.id, egg.shallowCopy()))
  },

  check() {
    for (let egg of this.world.eggs) {
      if (egg.owner) {
        return false
      }

      let startEgg = this.startEggs.get(egg.id)
      if (egg.x !== startEgg.x || egg.y !== startEgg.y ||
        (egg.value !== 0 && egg.value !== 9) ||
        (egg.value === 9 && startEgg.value < 5) ||
        (egg.value === 0 && startEgg.value >= 5)) {
        return false
      }
    }
    return true
  }
}

const wrongValueOnEggLossCondition = {
  beforeStart() {
    this.startEggs = new Map()
    this.world.eggs.forEach(egg => this.startEggs.set(egg.id, egg.shallowCopy()))
  },

  check() {
    return !!this.getReason()
  },

  getReason() {
    for (let egg of this.world.eggs) {
      let startEgg = this.startEggs.get(egg.id)
      if (!egg.owner && egg.value !== startEgg.value) {
        if (startEgg.value < 5 && egg.value !== 0) {
          return 'loss_reason_wrong_value_on_egg_not_0'
        } else if (startEgg.value >= 5 && egg.value !== 9) {
          return 'loss_reason_wrong_value_on_egg_not_9'
        }
      }
    }
    return null
  }
}

const displacedEggLossCondition = {
  beforeStart() {
    this.startEggs = new Map()
    this.world.eggs.forEach(egg => this.startEggs.set(egg.id, egg.shallowCopy()))
  },

  check() {
    for (let egg of this.world.eggs) {
      let startEgg = this.startEggs.get(egg.id)
      if (!egg.owner && (egg.x !== startEgg.x || egg.y !== startEgg.y)) {
        return true
      }
    }
    return false
  },

  getReason() {
    return 'loss_reason_egg_displaced'
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 400,
  speedTarget: 58,
  lengthTarget: 8,

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg', 'cauldron', 'nothing'],
    actionFunctions: ['step_once', 'take', 'drop', 'write'],
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'integer', 'myitem']
  },

  ruleset: {
    win: [winCondition],
    lose: [displacedEggLossCondition, 'or', wrongValueOnEggLossCondition, 'or', 'default_loss']
  },

  worldGenerator: {
    type: 'eggs_matrix',
    config: {
      originMarkerID: 99,
      width: 10,
      height: 10,

      strategy: {
        type: 'simple',
        eggConfig: {
          value: 'rng(0,9)',
        }
      }
    }
  }
}

export default level