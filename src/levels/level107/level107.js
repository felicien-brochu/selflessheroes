import map from './map107.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level107-messages-${language}.json`)
}

const winCondition = {
  beforeStart() {
    this.cauldronTargetValues = []
    for (let cauldron of this.world.cauldrons) {
      let eggs = this.world.eggs.filter(egg => egg.x === cauldron.x)
      let max = eggs.reduce((accumulator, egg) => Math.max(egg.value, accumulator), 0)
      this.cauldronTargetValues.push({
        cauldronID: cauldron.id,
        target: max,
      })
    }
  },

  check() {
    for (let cauldron of this.world.cauldrons) {
      if (cauldron.items.length !== 1) {
        return false
      }

      let targetValue = this.cauldronTargetValues.find(target => target.cauldronID === cauldron.id).target
      if (cauldron.items[0].value !== targetValue) {
        return false
      }
    }
    return true
  },
}

const wrongEggLossCondition = {
  beforeStart() {
    this.cauldronTargetValues = []
    for (let cauldron of this.world.cauldrons) {
      let eggs = this.world.eggs.filter(egg => egg.x === cauldron.x)
      let max = eggs.reduce((accumulator, egg) => Math.max(egg.value, accumulator), 0)

      this.cauldronTargetValues.push({
        cauldronID: cauldron.id,
        target: max,
      })
    }
  },

  check() {
    for (let cauldron of this.world.cauldrons) {
      let targetValue = this.cauldronTargetValues.find(target => target.cauldronID === cauldron.id).target
      if (cauldron.items.length > 1 || (cauldron.items.length === 1 && cauldron.items[0].value !== targetValue)) {
        return true
      }
    }
    return false
  },

  getReason() {
    return 'loss_reason_one_egg_not_max'
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 400,
  speedTarget: 45,
  lengthTarget: 7,

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg', 'cauldron', 'nothing'],
    actionFunctions: ['step_once', 'take', 'drop'],
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['object_type', 'direction', 'terrain_type', 'myitem']
  },

  ruleset: {
    win: [winCondition],
    lose: [wrongEggLossCondition, 'or', 'default_loss']
  },

  worldGenerator: [{
    type: 'eggs_matrix',
    config: {
      originMarkerID: 99,
      width: 1,
      height: 10,

      strategy: {
        type: 'simple',
        eggConfig: {
          value: 'rng(0,99)',
        }
      }
    }
  }, {
    type: 'eggs_matrix',
    config: {
      originMarkerID: 120,
      width: 1,
      height: 10,

      strategy: {
        type: 'simple',
        eggConfig: {
          value: 'rng(0,99)',
        }
      }
    }
  }, {
    type: 'eggs_matrix',
    config: {
      originMarkerID: 121,
      width: 1,
      height: 10,

      strategy: {
        type: 'simple',
        eggConfig: {
          value: 'rng(0,99)',
        }
      }
    }
  }, {
    type: 'eggs_matrix',
    config: {
      originMarkerID: 122,
      width: 1,
      height: 10,

      strategy: {
        type: 'simple',
        eggConfig: {
          value: 'rng(0,99)',
        }
      }
    }
  }, {
    type: 'eggs_matrix',
    config: {
      originMarkerID: 123,
      width: 1,
      height: 10,

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