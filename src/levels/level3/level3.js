import map from './map3.json'

const level = {
  mapConfig: map,
  name: {
    en: "Watch the step",
    fr: "Attention à la marche",
  },
  objective: {
    en: "Trigger all the %%icon icon-switch$%% switches",
    fr: "Active tous les %%icon icon-switch$%% boutons",
  },

  startingCode: "if e == switch:\n\tstep(e)\nendif\n",
  maxStep: 100,
  speedTarget: 2,
  lengthTarget: 3,

  compilerConfig: {
    excludePrimary: ['assign', 'jump', 'anchor'],
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