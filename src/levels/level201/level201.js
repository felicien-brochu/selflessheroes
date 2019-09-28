import map from './map201.json'

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
  name: {
    en: "Rating",
    fr: "Notation",
  },
  objective: {
    en: "Use %%statement action-statement$write%% to write on %%icon icon-egg$%% eggs. For each %%icon icon-egg$%% egg, if it is less than 5, write 0 on it, otherwise write 9.",
    fr: "Utilise %%statement action-statement$écrire%% pour écrire sur les %%icon icon-egg$%% œufs. Pour chaque %%icon icon-egg$%% œuf, s'il est inférieur à 5, écris 0 dessus, sinon écris 9.",
  },
  messages: {
    loss_reason_wrong_value_on_egg_not_0: {
      en: "You wrote something else than 0 on an %%icon icon-egg$%% egg that was less than 5",
      fr: "Tu as écrit quelque chose d'autre que 0 sur un %%icon icon-egg$%% œuf qui était inférieur à 5",
    },
    loss_reason_wrong_value_on_egg_not_9: {
      en: "You wrote something else than 9 on an %%icon icon-egg$%% egg that was greater than or equal to 5",
      fr: "Tu as écrit quelque chose d'autre que 9 sur un %%icon icon-egg$%% œuf qui était supérieur ou égal à 5",
    },
    loss_reason_egg_displaced: {
      en: "The %%icon icon-egg$%% eggs must stay where you found them",
      fr: "Les %%icon icon-egg$%% œufs doivent rester sur la case où tu les as trouvés",
    },
  },

  maxStep: 400,
  speedTarget: 58,
  lengthTarget: 8,

  compilerConfig: {
    excludePrimary: ['assign'],
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