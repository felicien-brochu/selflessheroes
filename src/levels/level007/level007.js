import map from './map007.json'

const level = {
  mapConfig: map,
  name: {
    en: "Sharp turn",
    fr: "Virage serré",
  },
  objective: {
    en: "Lit all %%icon icon-bonfire$%% bonfires\n\n%%icon mdi mdi-alert-octagon-outline$%%Warning: all the heroes must survive",
    fr: "Allume tous les %%icon icon-bonfire$%% feux\n\n%%icon mdi mdi-alert-octagon-outline$%%Attention: aucun héro ne doit mourir",
  },
  startingCode: "if w != wall :\n\tstep(w)\nelse\n\tstep(e)\nendif\n",
  maxStep: 100,
  speedTarget: 4,
  lengthTarget: 5,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['assign', 'jump', 'anchor', 'clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['bonfire', 'hero', 'nothing'],
    actionFunctions: ['step_once', 'fireball'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: 'all_bonfires',
    lose: ['one_hero_dead', 'or', 'default_loss']
  }
}

export default level