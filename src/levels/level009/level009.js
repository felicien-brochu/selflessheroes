import map from './map009.json'

const level = {
  mapConfig: map,
  name: {
    en: "Winding path",
    fr: "Chemin sinueux",
  },
  objective: {
    en: "Lit all %%icon icon-bonfire$%% bonfires",
    fr: "Allume tous les %%icon icon-bonfire$%% feux",
  },

  maxStep: 200,
  speedTarget: 62,
  lengthTarget: 7,
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
    lose: 'default_loss'
  }
}

export default level