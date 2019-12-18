import map from './map010.json'

const level = {
  mapConfig: map,
  name: {
    en: "Winding path 2",
    fr: "Chemin sinueux 2",
  },
  objective: {
    en: "Lit all %%icon icon-bonfire$%% bonfires\n\n%%icon mdi mdi-alert-octagon-outline$%%Warning: all the heroes must survive\n\n\n%%icon mdi mdi-information-outline$%% copy/paste the code from the previous level to go faster",
    fr: "Allume tous les %%icon icon-bonfire$%% feux\n\n%%icon mdi mdi-alert-octagon-outline$%%Attention: aucun héro ne doit mourir\n\n\n%%icon mdi mdi-information-outline$%% Pour aller plus vite, copie/colle le code du niveau précédent",
  },

  maxStep: 200,
  speedTarget: 69,
  lengthTarget: 8,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
    terrainTypes: ['hole', 'floor', 'wall'],
    objectTypes: ['bonfire', 'nothing'],
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