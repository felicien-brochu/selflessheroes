import map from './map204.json'

const winCondition = {
  beforeStart() {
    let numberedEggsOriginMarker = this.world.findConfigObjectByID(120)
    let writeEggsOriginMarker = this.world.findConfigObjectByID(99)
    this.numberedEggs = this.world.eggs.filter(egg => egg.y >= numberedEggsOriginMarker.y && egg.y < numberedEggsOriginMarker.y + 6)
    this.writeEggs = this.world.eggs.filter(egg => egg.y === writeEggsOriginMarker.y).sort((a, b) => a.x - b.x).map(egg => egg.shallowCopy())
    for (let i = 0; i < 10; i++) {
      let eggLine = this.numberedEggs.filter(egg => egg.x === numberedEggsOriginMarker.x + i)
      let max = eggLine.reduce((acc, egg) => Math.max(acc, egg.value), 0)
      this.writeEggs[i] = {
        egg: this.writeEggs[i],
        max: max,
      }
    }
  },

  check() {
    for (let target of this.writeEggs) {
      let actualEgg = this.world.findWorldObjectByID(target.egg.id)
      if (!!actualEgg.owner ||
        actualEgg.x !== target.egg.x ||
        actualEgg.y !== target.egg.y ||
        actualEgg.value !== target.max
      ) {
        return false
      }
    }
    return true
  }
}

const wrongValueOnEggLossCondition = {
  beforeStart() {
    let numberedEggsOriginMarker = this.world.findConfigObjectByID(120)
    let writeEggsOriginMarker = this.world.findConfigObjectByID(99)
    this.numberedEggs = this.world.eggs.filter(egg => egg.y >= numberedEggsOriginMarker.y && egg.y < numberedEggsOriginMarker.y + 6)
    this.writeEggs = this.world.eggs.filter(egg => egg.y === writeEggsOriginMarker.y).sort((a, b) => a.x - b.x)

    for (let i = 0; i < 10; i++) {
      let eggLine = this.numberedEggs.filter(egg => egg.x === numberedEggsOriginMarker.x + i)
      let max = eggLine.reduce((acc, egg) => Math.max(acc, egg.value), 0)
      this.writeEggs[i] = {
        egg: this.writeEggs[i],
        max: max,
      }
    }
  },

  check() {
    return this.writeEggs.some(target => target.egg.value !== target.max && target.egg.value !== 0)
  },

  getReason() {
    return 'loss_reason_wrong_value_on_egg'
  }
}

const displacedNumberedEggLossCondition = {
  beforeStart() {
    let numberedEggsOriginMarker = this.world.findConfigObjectByID(120)
    this.numberedEggs = this.world.eggs.filter(egg => egg.y >= numberedEggsOriginMarker.y && egg.y < numberedEggsOriginMarker.y + 6)
  },

  check() {
    return this.numberedEggs.some(egg => !!egg.owner)
  },

  getReason() {
    return 'loss_reason_numbered_egg_displaced'
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Inspection",
    fr: "Inspection",
  },
  objective: {
    en: "Write the maximum of each column on the bottom %%icon icon-egg$%% eggs\n\n%%icon mdi mdi-alert-octagon-outline$%%Warning: you must not touch the top %%icon icon-egg$%% eggs",
    fr: "Écris le maximum de chaque colonne sur les %%icon icon-egg$%% œufs du bas\n\n%%icon mdi mdi-alert-octagon-outline$%%Attention: tu ne dois pas toucher aux %%icon icon-egg$%% œufs du haut",
  },
  messages: {
    loss_reason_wrong_value_on_egg: {
      en: "You wrote something else than the maximum value of the column on an %%icon icon-egg$%% egg",
      fr: "Tu as écrit quelque chose d'autre que le maximum de la colonne sur un %%icon icon-egg$%% œuf",
    },
    loss_reason_numbered_egg_displaced: {
      en: "You must not touch the top %%icon icon-egg$%% eggs",
      fr: "Tu ne dois pas toucher aux %%icon icon-egg$%% œufs du haut",
    },
  },

  maxStep: 400,
  speedTarget: 33,
  lengthTarget: 8,

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['hero', 'egg', 'nothing'],
    actionFunctions: ['step_once', 'take', 'drop', 'write'],
    valueFunctions: ['set'],
    variables: 1,
    leftComparisonExpressions: ['direction', 'variable', 'myitem'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'variable', 'integer', 'myitem']
  },

  ruleset: {
    win: [winCondition],
    lose: [displacedNumberedEggLossCondition, 'or', wrongValueOnEggLossCondition, 'or', 'default_loss']
  },

  worldGenerator: [{
    type: 'eggs_matrix',
    config: {
      originMarkerID: 120,
      width: 10,
      height: 6,

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
      originMarkerID: 99,
      width: 10,
      height: 1,

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