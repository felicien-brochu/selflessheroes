import map from './map404.json'

const winCondition = {
  beforeStart() {
    let nEgg = this.world.eggs.find(egg => egg.y === 2)
    this.targetEgg = this.world.eggs.find(egg => egg.y === 3 && egg.x === nEgg.value + 2).shallowCopy()
  },

  check() {
    let cauldronContent = this.world.cauldrons[0].items
    return cauldronContent.length === 1 && cauldronContent[0].id === this.targetEgg.id
  }
}

const tookWrongEggCondition = {
  beforeStart() {
    let nEgg = this.world.eggs.find(egg => egg.y === 2)
    this.targetEgg = this.world.eggs.find(egg => egg.y === 3 && egg.x === nEgg.value + 2).shallowCopy()
  },

  check() {
    return this.world.heroes.some(hero => hero.item && hero.item.id !== this.targetEgg.id)
  },

  getReason() {
    return 'loss_reason_took_wrong_egg'
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Lottery",
    fr: "Loterie",
  },
  objective: {
    en: "The number on the %%icon icon-egg$%% egg above the %%icon icon-cauldron$%% cauldron indicates which egg to put in the cauldron.\n\nFor example, if the egg says 4, then you have to put the 4th %%icon icon-egg$%% egg in the %%icon icon-cauldron$%% cauldron.\n\n%%icon mdi mdi-information-outline$%% When a clone is created, it inherits the variables from its creator.\n\n%%icon mdi mdi-alert-octagon-outline$%%Do not take the other %%icon icon-egg$%% eggs.",
    fr: "Le nombre sur l'%%icon icon-egg$%% œuf au-dessus du %%icon icon-cauldron$%% chaudron indique quel œuf il faut mettre dans le chaudron.\n\nPar exemple, si l'œuf indique 4, alors il faut mettre le 4ème %%icon icon-egg$%% œuf dans le %%icon icon-cauldron$%% chaudron.\n\n%%icon mdi mdi-information-outline$%% Quand un clone est créé, il hérite des variables de son créateur.\n\n%%icon mdi mdi-alert-octagon-outline$%%Il ne faut pas prendre les autres %%icon icon-egg$%% œufs.",
  },

  messages: {
    loss_reason_took_wrong_egg: {
      en: "One of the heroes took the wrong egg",
      fr: "Un des héros a pris le mauvais œuf"
    },
  },

  maxStep: 200,
  speedTarget: 32,
  lengthTarget: 10,

  compilerConfig: {
    excludePrimary: [],
    cloneIsDeadly: false,
    terrainTypes: ['floor', 'wall'],
    objectTypes: ['hero', 'egg', 'cauldron', 'nothing'],
    actionFunctions: ['take', 'drop'],
    valueFunctions: ['set', 'calc'],
    variables: 1,
    leftComparisonExpressions: ['direction', 'myitem', 'variable'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'myitem', 'integer', 'variable']
  },

  ruleset: {
    win: [winCondition],
    lose: [tookWrongEggCondition, 'or', 'one_hero_dead', 'or', 'default_loss']
  },
}

export default level