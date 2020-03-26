import map from './map112.json'
const messages = {}
for (let language of SUPPORTED_LANGUAGES) {
  messages[language] = require(`./level112-messages-${language}.json`)
}

const winCondition = {
  beforeStart() {
    let eggsOriginMarker = this.world.findConfigObjectByID(99)
    this.targetEggs = this.world.eggs.filter(egg => egg.y < eggsOriginMarker.y + 4)
  },

  check() {
    if (!this.targetEggs.every(egg => egg.removed)) {
      return false
    }

    let i = 0
    for (let cauldron of this.world.cauldrons) {
      if (!cauldron.items.every(item => item.value === i)) {
        return false
      }
      i++
    }
    return true
  },
}

const wrongEggInCauldronLossCondition = {
  check() {
    let i = 0
    for (let cauldron of this.world.cauldrons) {
      if (!cauldron.items.every(item => item.value === i)) {
        return true
      }
      i++
    }
    return false
  },

  getReason() {
    return 'loss_reason_wrong_egg_in_cauldron'
  }
}

const tookLabelEggLossCondition = {
  beforeStart() {
    let labelEggOrigin = this.world.findWorldObjectByID(120)
    this.labelEggs = this.world.eggs.filter(egg => egg.y === labelEggOrigin.y)
  },

  check() {
    return !this.labelEggs.every(egg => !egg.owner)
  },

  getReason() {
    return 'loss_reason_took_label_egg'
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 8000,
  speedTarget: 1500,
  lengthTarget: 23,

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
    terrainTypes: ['hole', 'floor'],
    objectTypes: ['egg', 'cauldron', 'nothing'],
    actionFunctions: ['step_once', 'take', 'drop'],
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['direction', 'object_type', 'terrain_type', 'myitem']
  },

  ruleset: {
    win: [winCondition],
    lose: [wrongEggInCauldronLossCondition, 'or', tookLabelEggLossCondition, 'or', 'default_loss']
  },

  worldGenerator: {
    type: 'eggs_matrix',
    config: {
      originMarkerID: 99,
      width: 7,
      height: 4,

      strategy: {
        type: 'simple',
        eggConfig: {
          value: 'rng(0,6)',
        }
      }
    }
  }
}

export default level