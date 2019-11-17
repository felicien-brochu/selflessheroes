import map from './map003.json'

const level = {
  mapConfig: map,
  name: {
    en: "Watch the step",
    fr: "Attention à la marche",
  },
  objective: {
    en: "Trigger all the %%icon icon-switch$%% switches.\n\n%%icon mdi mdi-information-outline$%% Check the help about %%statement branching-statement$if%% to better understand how it works.",
    fr: "Active tous les %%icon icon-switch$%% boutons.\n\n%%icon mdi mdi-information-outline$%% Consulte l'aide à propos de %%statement branching-statement$si%% pour mieux comprendre comment ça marche.",
  },

  startingCode: "if e == switch:\n\tstep(e)\nendif\n",
  maxStep: 100,
  speedTarget: 2,
  lengthTarget: 3,

  compilerConfig: {
    excludePrimary: ['assign', 'jump', 'anchor', 'clone'],
    terrainTypes: ['hole', 'floor'],
    objectTypes: ['switch', 'nothing'],
    actionFunctions: ['step_once'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: 'all_switches',
    lose: 'default_loss'
  }
}

export default level