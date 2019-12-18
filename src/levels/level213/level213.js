import map from './map213.json'

const winCondition = {
  beforeStart() {},

  check() {
    return this.world.cauldrons[0].items.length === this.world.eggs.length
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Bullseye",
    fr: "En plein dans le mille",
  },
  objective: {
    en: "Put all the %%icon icon-egg$%% eggs into the %%icon icon-cauldron$%% cauldron",
    fr: "Mets tous les %%icon icon-egg$%% œufs dans le %%icon icon-cauldron$%% chaudron",
  },

  maxStep: 200,
  speedTarget: 63,
  lengthTarget: 5,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['if', 'else', 'endif', 'clone'],
    terrainTypes: ['wall', 'floor', 'hole'],
    objectTypes: ['cauldron', 'egg', 'hero'],
    actionFunctions: ['take', 'drop'],
    valueFunctions: ['nearest'],
    variables: 2,
  },

  ruleset: {
    win: [winCondition],
    lose: 'default_loss'
  },
}

export default level