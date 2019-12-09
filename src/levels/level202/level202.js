import map from './map202.json'

const winCondition = {
  beforeStart() {
    this.targetEggs = this.world.eggs.filter(egg => egg.x === 3).map(egg => egg.shallowCopy())
    this.duplicateEggs = this.world.eggs.filter(egg => egg.x === 9).map(egg => egg.shallowCopy())
  },

  check() {
    for (let targetEgg of this.targetEggs) {
      let duplicateEgg = this.duplicateEggs.find(egg => egg.y === targetEgg.y)
      let actualEgg = this.world.findWorldObjectByID(duplicateEgg.id)

      if (actualEgg.value !== targetEgg.value ||
        !!actualEgg.owner ||
        actualEgg.x !== duplicateEgg.x ||
        actualEgg.y !== duplicateEgg.y
      ) {
        return false
      }
    }
    return true
  }
}

const wrongValueOnEggLossCondition = {
  beforeStart() {
    this.targetEggs = this.world.eggs.filter(egg => egg.x === 3).map(egg => egg.shallowCopy())
    this.duplicateEggs = this.world.eggs.filter(egg => egg.x === 9).map(egg => egg.shallowCopy())
  },

  check() {
    for (let targetEgg of this.targetEggs) {
      let duplicateEgg = this.duplicateEggs.find(egg => egg.y === targetEgg.y)
      let actualEgg = this.world.findWorldObjectByID(duplicateEgg.id)
      if (actualEgg.value !== 0 &&
        actualEgg.value !== targetEgg.value) {
        return true
      }
    }
    return false
  },

  getReason() {
    return 'loss_reason_wrong_value_on_egg'
  }
}

const displacedTargetEggLossCondition = {
  beforeStart() {
    this.targetEggs = this.world.eggs.filter(egg => egg.x === 3)
  },

  check() {
    return this.targetEggs.some(egg => !!egg.owner)
  },

  getReason() {
    return 'loss_reason_target_egg_displaced'
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Duplicates",
    fr: "Duplicata",
  },
  objective: {
    en: "Copy the %%icon icon-egg$%% left eggs to the %%icon icon-egg$%% right eggs.\n\n%%icon mdi mdi-information-outline$%% Your heroes are now able to memorize things. Use %%statement assign-statement$set%% to memorize the value of an egg and thus be able to write it later.\n\n%%icon mdi mdi-alert-octagon-outline$%%Warning: you must not touch the %%icon icon-egg$%% eggs that are on the left. At the end, all %%icon icon-egg$%% eggs must be on the floor and in the same place as at the beginning.",
    fr: "Recopie les %%icon icon-egg$%% œufs de gauche sur les %%icon icon-egg$%% œufs de droite.\n\n%%icon mdi mdi-information-outline$%% Les héros sont maintenant capables de garder des choses en mémoire. Utilise %%statement assign-statement$init%% pour mémoriser la valeur d'un œuf et ainsi pouvoir l'écrire plus tard.\n\n%%icon mdi mdi-alert-octagon-outline$%%Attention: tu ne dois pas toucher les %%icon icon-egg$%% œufs qui sont à gauche. À la fin, tous les %%icon icon-egg$%% œufs doivent être au sol et à la même place qu'au début.",
  },
  messages: {
    loss_reason_wrong_value_on_egg: {
      en: "You wrote a wrong number on this %%icon icon-egg$%% egg.\nCopy numbers of the left eggs.",
      fr: "Tu as écrit un mauvais nombre sur cet %%icon icon-egg$%% œuf.\nCopie les nombres des œufs de gauche.",
    },
    loss_reason_target_egg_displaced: {
      en: "You must not touch the %%icon icon-egg$%% eggs on the left",
      fr: "Tu ne dois pas toucher aux %%icon icon-egg$%% œufs qui sont à gauche",
    },
  },

  startingCode: "$a = set(w)\n",
  maxStep: 100,
  speedTarget: 15,
  lengthTarget: 7,

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg', 'hero', 'nothing'],
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
      originMarkerID: 99,
      width: 1,
      height: 5,

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