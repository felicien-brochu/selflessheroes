/* length: 7
take(s)
a:
step(s)
if here > myitem :
	drop(e)
	take(here)
endif
drop(s)
jump a
*/

/* speed: 43.565
step(s)
take(here)
a:
step(s)
if here > myitem :
	drop(e)
	take(here)
endif
drop(s)
jump a
*/

const winCondition = {
  step() {
    if (this.world.steps === 1) {
      this.cauldronTargetValues = []
      for (let cauldron of this.world.cauldrons) {
        let eggs = this.world.eggs.filter(egg => egg.x === cauldron.x)
        let max = eggs.reduce((accumulator, egg) => Math.max(egg.value, accumulator), 0)
        this.cauldronTargetValues.push({
          cauldronID: cauldron.id,
          target: max,
        })
      }
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

  getReason() {
    return 'reason_custom'
  }
}

const wrongEggLossCondition = {
  step() {
    if (this.world.steps === 1) {
      this.cauldronTargetValues = []
      for (let cauldron of this.world.cauldrons) {
        let eggs = this.world.eggs.filter(egg => egg.x === cauldron.x)
        let max = eggs.reduce((accumulator, egg) => Math.max(egg.value, accumulator), 0)

        this.cauldronTargetValues.push({
          cauldronID: cauldron.id,
          target: max,
        })
      }
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
  name: {
    en: "Picking 2",
    fr: "Cueillette 2",
  },
  objective: {
    en: "Put the maximum %%icon icon-egg$%% egg from each vertical line into the corresponding %%icon icon-cauldron$%% cauldron\n\n%%icon mdi mdi-alert-octagon-outline$%%Warning: don't put the other %%icon icon-egg$%% eggs into the %%icon icon-cauldron$%% cauldrons",
    fr: "Mets l'%%icon icon-egg$%% œuf maximum de chaque ligne verticale dans le %%icon icon-cauldron$%% chaudron correspondant\n\n%%icon mdi mdi-alert-octagon-outline$%%Attention: ne mets pas d'autres %%icon icon-egg$%% œufs que les maximums dans les %%icon icon-cauldron$%% chaudrons",
  },
  messages: {
    loss_reason_one_egg_not_max: {
      en: "You put an %%icon icon-egg$%% egg which is not the maximum of its vertical line into a %%icon icon-cauldron$%% cauldron",
      fr: "Tu as mis un %%icon icon-egg$%% œuf qui n'est pas le maximum de sa ligne verticale dans un %%icon icon-cauldron$%% chaudron",
    }
  },

  startingCode: "",
  startingEditorType: "graph",
  maxStep: 400,
  speedTarget: 44,
  lengthTarget: 7,

  compilerConfig: {
    excludePrimary: ['assign'],
    variables: 0,
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg', 'cauldron', 'nothing'],
    valueFunctions: [],
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
        type: 'random_columns',
        minEggs: 10,
        maxEggs: 10,
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
        type: 'random_columns',
        minEggs: 10,
        maxEggs: 10,
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
        type: 'random_columns',
        minEggs: 10,
        maxEggs: 10,
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
        type: 'random_columns',
        minEggs: 10,
        maxEggs: 10,
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
        type: 'random_columns',
        minEggs: 10,
        maxEggs: 10,
        eggConfig: {
          value: 'rng(0,99)',
        }
      }
    }
  }, ]
}

export default level