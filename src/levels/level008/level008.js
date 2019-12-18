import map from './map008.json'

const level = {
  mapConfig: map,
  name: {
    en: "Candlelight vigil",
    fr: "Veillée aux flambeaux",
  },
  objective: {
    en: "Lit all %%icon icon-bonfire$%% bonfires\n\n%%icon mdi mdi-information-outline$%% Use %%statement branching-statement$jump%% to repeat actions",
    fr: "Allume tous les %%icon icon-bonfire$%% feux\n\n%%icon mdi mdi-information-outline$%% Utilise %%statement branching-statement$saut%% pour répéter des actions en boucle",
  },

  startingCode: "a:\nstep(e)\njump a\n",
  maxStep: 200,
  speedTarget: 71,
  lengthTarget: 4,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
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