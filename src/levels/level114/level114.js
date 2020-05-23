import map from './map114.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level114-messages-${language}.json`)
}

const winCondition = {
  check(world) {
    let eggsOriginMarker = world.findConfigObjectByID(99)
    let eggs = world.eggs.slice().sort((a, b) => a.x - b.x)

    let currentMax = -1
    for (let egg of eggs) {
      if (egg.y !== eggsOriginMarker.y || egg.owner || egg.value < currentMax) {
        return false
      }
      currentMax = egg.value
    }

    return true
  },
}

const eggInHoleLossCondition = {
  check(world) {
    return world.eggs.some(egg => egg.removed)
  },

  getReason(world) {
    return 'loss_reason_egg_in_hole'
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 8000,
  speedTarget: 600,
  lengthTarget: 14,

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
    terrainTypes: ['wall', 'hole', 'floor'],
    objectTypes: ['egg', 'nothing'],
    actionFunctions: ['step_once', 'take', 'drop'],
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['direction', 'object_type', 'terrain_type', 'myitem']
  },

  ruleset: {
    win: [winCondition],
    lose: [eggInHoleLossCondition, 'or', 'default_loss']
  },

  worldGenerator: {
    type: 'eggs_matrix',
    config: {
      originMarkerID: 99,
      width: 13,
      height: 1,

      strategy: {
        type: 'simple',
        eggConfig: {
          value: 'rng(0,99)',
        }
      }
    }
  }
}

export default level