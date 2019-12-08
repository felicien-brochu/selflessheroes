import map from './map305.json'

const winCondition = {
  beforeStart() {
    this.masterEgg = this.world.eggs.find(egg => egg.id === 316).shallowCopy()
    this.selectedEggs = this.world.eggs
      .filter(egg => egg.value % 2 === this.masterEgg.value % 2 && egg.id !== this.masterEgg.id)
      .map(egg => egg.id)
  },

  check() {
    return this.selectedEggs.every(eggID => this.world.cauldrons.some(cauldron => cauldron.items.some(item => item.id === eggID)))
  },
}

const wrongEggInCauldronLossCondition = {
  beforeStart() {
    this.masterEgg = this.world.eggs.find(egg => egg.id === 316).shallowCopy()
    this.selectedEggs = this.world.eggs
      .filter(egg => egg.value % 2 === this.masterEgg.value % 2 && egg.id !== this.masterEgg.id)
      .map(egg => egg.id)
  },

  check() {
    return this.world.cauldrons.some(cauldron => cauldron.items.some(item => this.selectedEggs.every(eggID => item.id !== eggID)))
  },

  getReason() {
    if (this.masterEgg.value % 2 === 0) {
      return 'loss_reason_wrong_egg_in_cauldron_even'
    } else {
      return 'loss_reason_wrong_egg_in_cauldron_odd'
    }
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Oui chef!",
    fr: "Oui chef\u00A0!",
  },
  objective: {
    en: "Put %%icon icon-egg$%% eggs that have the same parity as the top egg in the %%icon icon-cauldron$%% cauldrons.\n\nFor example, if the top egg is even, put all the even eggs into the cauldrons.\n\n%%icon mdi mdi-information-outline$%% If %%type-operator$n%% is an even number, then %%type-operator$n\u00A0%\u00A02\u00A0=\u00A00%%.",
    fr: "Mets les %%icon icon-egg$%% œufs qui ont la même parité que l'œuf du haut dans les %%icon icon-cauldron$%% chaudrons.\n\nPar exemple, si l'œuf du haut est pair, mets tous les œufs pairs dans les chaudrons.\n\n%%icon mdi mdi-information-outline$%% Si %%type-operator$n%% est un nombre pair, alors %%type-operator$n\u00A0%\u00A02\u00A0=\u00A00%%.",
  },
  messages: {
    loss_reason_wrong_egg_in_cauldron_even: {
      en: "A hero put an odd %%icon icon-egg$%% egg in a %%icon icon-cauldron$%% cauldron while the top egg is even.",
      fr: "Un héro a mis un %%icon icon-egg$%% œuf impair dans un %%icon icon-cauldron$%% chaudron alors que l'œuf du haut est pair.",
    },
    loss_reason_wrong_egg_in_cauldron_odd: {
      en: "A hero put an even %%icon icon-egg$%% egg in a %%icon icon-cauldron$%% cauldron while the top egg is odd.",
      fr: "Un héro a mis un %%icon icon-egg$%% œuf pair dans un %%icon icon-cauldron$%% chaudron alors que l'œuf du haut est impair.",
    },
  },

  maxStep: 40,
  speedTarget: 5,
  lengthTarget: 10,

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['floor', 'wall'],
    objectTypes: ['cauldron'],
    actionFunctions: ['drop', 'tell', 'listen'],
    valueFunctions: ['set', 'calc'],
    variables: 1,
    messages: 8,
    leftComparisonExpressions: ['direction', 'myitem', 'variable'],
    rightComparisonExpressions: ['terrain_type', 'object_type', 'integer'],
  },

  ruleset: {
    win: [winCondition],
    lose: [wrongEggInCauldronLossCondition, 'or', 'default_loss']
  },
}

export default level