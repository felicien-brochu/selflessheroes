import map from './map006.json'

const level = {
  mapConfig: map,
  name: {
    en: "Fireball",
    fr: "Allumer le feu",
  },
  objective: {
    en: "Lit all %%icon icon-bonfire$%% bonfires\n\n%%icon mdi mdi-information-outline$%% Use %%statement action-statement$fireball%% to lit the bonfires",
    fr: "Allume tous les %%icon icon-bonfire$%% feux\n\n%%icon mdi mdi-information-outline$%% Utilise %%statement action-statement$boule de feu%% pour allumer les feux",
  },

  maxStep: 100,
  speedTarget: 2,
  lengthTarget: 2,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['assign', 'jump', 'anchor', 'clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['bonfire', 'nothing'],
    actionFunctions: ['step_once', 'fireball'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: 'all_bonfires',
    lose: 'default_loss'
  }
}

export default level