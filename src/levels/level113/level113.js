import map from './map113.json'

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
  name: {
    en: "Sorting",
    fr: "Tri",
  },
  objective: {
    en: "Sort the %%icon icon-egg$%% eggs from the smallest on the left to the largest on the right.\n\n%%icon mdi mdi-information-outline$%% At the end, the %%icon icon-egg$%% eggs must be on the floor in the same line as at the beginning.",
    fr: "Trie les %%icon icon-egg$%% œufs du plus petit à gauche au plus grand à droite.\n\n%%icon mdi mdi-information-outline$%% À la fin, les %%icon icon-egg$%% œufs doivent être au sol sur la même ligne qu'au début.",
  },
  messages: {
    loss_reason_egg_in_hole: {
      en: "You throw the %%icon icon-egg$%% eggs in the holes?\nFunny way to sort them…",
      fr: "Tu jettes les %%icon icon-egg$%% œufs dans les trous ?\nDrôle de façon de les trier…",
    },
  },

  maxStep: 8000,
  speedTarget: 600,
  lengthTarget: 14,

  compilerConfig: {
    excludePrimary: ['assign'],
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