import map from './map205.json'

const winCondition = {
  beforeStart() {
    this.startEggs = this.world.eggs.map(egg => egg.shallowCopy())
  },

  check() {
    return this.startEggs.every(startEgg => {
      let actualEgg = this.world.eggs.find(egg => egg.id === startEgg.id)
      return actualEgg.value === startEgg.value + 1
    })
  }
}

const wrongValueOnEggLossCondition = {
  beforeStart() {
    this.startEggs = this.world.eggs.map(egg => egg.shallowCopy())
  },

  check() {
    return this.startEggs.some(startEgg => {
      let actualEgg = this.world.eggs.find(egg => egg.id === startEgg.id)
      return actualEgg.value !== startEgg.value && actualEgg.value !== startEgg.value + 1
    })
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
    en: "Something more",
    fr: "Quelque chose en plus",
  },
  objective: {
    en: "Add 1 to all %%icon icon-egg$%% eggs.\n\n%%icon mdi mdi-information-outline$%% Your heroes are now able to do calculations. Use %%statement assign-statement$calc%% to calculate.",
    fr: "Ajoute 1 à tous les %%icon icon-egg$%% œufs.\n\n%%icon mdi mdi-information-outline$%% Les héros sont maintenant capables de faire des calculs. Utilise %%statement assign-statement$calc%% pour calculer quelque chose.",
  },
  messages: {
    loss_reason_wrong_value_on_egg: {
      en: "You didn't write the right number",
      fr: "Tu n'as pas écrit le bon nombre",
    },
  },

  maxStep: 20,
  speedTarget: 2,
  lengthTarget: 2,

  compilerConfig: {
    excludePrimary: ['if', 'else', 'endif', 'jump', 'anchor', 'clone'],
    actionFunctions: ['write'],
    valueFunctions: ['set', 'calc'],
    variables: 1,
  },

  ruleset: {
    win: [winCondition],
    lose: [wrongValueOnEggLossCondition, 'or', 'default_loss']
  },
}

export default level