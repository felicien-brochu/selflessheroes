import map from './map004.json'

const level = {
  mapConfig: map,
  name: {
    en: "Seperate ways",
    fr: "Chacun son chemin",
  },
  objective: {
    en: "Trigger all the %%icon icon-switch$%% switches",
    fr: "Active tous les %%icon icon-switch$%% boutons",
  },

  startingCode: "if e == hero:\n\tstep(w)\nendif\n",
  maxStep: 100,
  speedTarget: 4,
  lengthTarget: 6,

  compilerConfig: {
    excludePrimary: ['assign', 'jump', 'anchor', 'clone'],
    objectTypes: ['hero', 'switch', 'nothing'],
    actionFunctions: ['step_once'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type']
  },

  ruleset: {
    win: 'all_switches',
    lose: 'default_loss'
  }
}

export default level