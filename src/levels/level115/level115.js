import map from './map115.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level115-messages-${language}.json`)
}

const winCondition = {
  check() {
    let eggsOriginMarker = this.world.findConfigObjectByID(99)
    let eggs = this.world.eggs.slice().sort((a, b) => a.x - b.x)

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
  check() {
    return this.world.eggs.some(egg => egg.removed)
  },

  getReason() {
    return 'loss_reason_egg_in_hole'
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 8000,
  speedTarget: 630,
  lengthTarget: 13,

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
    terrainTypes: ['wall', 'hole', 'floor'],
    objectTypes: ['egg', 'hero', 'nothing'],
    actionFunctions: ['step_once', 'take', 'drop'],
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['direction', 'object_type', 'terrain_type', 'myitem']
  },

  ruleset: {
    win: [winCondition],
    lose: [eggInHoleLossCondition, 'or', 'one_hero_dead', 'or', 'default_loss']
  },

  worldGenerator: {
    type: 'eggs_matrix',
    config: {
      originMarkerID: 99,
      width: 14,
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