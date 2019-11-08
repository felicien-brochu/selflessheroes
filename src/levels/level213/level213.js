import map from './map213.json'

const winCondition = {
  beforeStart() {
    this.droppedEggs = []
  },

  check() {
    let cauldronEggs = this.world.cauldrons[0].items
    if (cauldronEggs.length - this.droppedEggs > 1) {
      return false
    } else if (cauldronEggs.length - this.droppedEggs.length === 1) {
      let egg = cauldronEggs[cauldronEggs.length - 1]
      if (egg.value - 1 > this.droppedEggs.reduce((acc, egg) => Math.max(acc, egg.value), -1)) {
        return false
      }
    }
    this.droppedEggs = cauldronEggs.slice()
    return cauldronEggs.length >= this.world.eggs.length
  }
}

const wrongEggOrderCondition = {
  beforeStart() {
    this.droppedEggs = []
  },

  check() {
    let cauldronEggs = this.world.cauldrons[0].items
    if (cauldronEggs.length - this.droppedEggs > 1) {
      return true
    } else if (cauldronEggs.length - this.droppedEggs.length === 1) {
      let egg = cauldronEggs[cauldronEggs.length - 1]
      if (egg.value - 1 > this.droppedEggs.reduce((acc, egg) => Math.max(acc, egg.value), -1)) {
        return true
      }
    }
    this.droppedEggs = cauldronEggs.slice()
    return false
  },

  getReason() {
    return 'loss_reason_wrong_egg_order'
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Ticking bomb",
    fr: "Bombe à retardement",
  },
  objective: {
    en: "Put the %%icon icon-egg$%% eggs into the %%icon icon-cauldron$%% cauldron in ascending order. First egg 0 then 1 etc.",
    fr: "Mets les %%icon icon-egg$%% œufs dans le %%icon icon-cauldron$%% chaudron dans l'ordre croissant. D'abord l'œuf 0 puis le 1 etc.",
  },
  messages: {
    loss_reason_wrong_egg_order: {
      en: "You put some %%icon icon-egg$%% egg into the %%icon icon-cauldron$%% cauldron in the wrong order. You must put them in ascending order into the cauldron.",
      fr: "Tu as mis un %%icon icon-egg$%% œuf dans le %%icon icon-cauldron$%% chaudron dans le mauvais ordre. Tu dois les mettre en ordre croissant dans le chaudron.",
    },
  },

  maxStep: 200,
  speedTarget: 48,
  lengthTarget: 8,

  compilerConfig: {
    excludePrimary: [],
    terrainTypes: ['floor', 'hole'],
    objectTypes: ['cauldron', 'egg', 'hero', 'nothing'],
    actionFunctions: ['take', 'drop', 'step_once'],
    valueFunctions: ['set', 'calc', 'nearest'],
    variables: 3,
    leftComparisonExpressions: ['direction', 'variable', 'myitem'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'variable', 'integer', 'myitem']
  },

  ruleset: {
    win: [winCondition],
    lose: [wrongEggOrderCondition, 'or', 'default_loss']
  },
}

export default level