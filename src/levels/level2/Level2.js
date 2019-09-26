import map from './map2.json'

/* speed: 3, length: 3
step(s)
step(se)
*/

const level = {
  mapConfig: map,
  name: {
    en: "Step aside",
    fr: "Pas de côté",
  },
  objective: {
    en: "Trigger all the %%icon icon-switch$%% switches",
    fr: "Active tous les %%icon icon-switch$%% boutons",
  },

  maxStep: 100,
  speedTarget: 2,
  lengthTarget: 2,

  compilerConfig: {
    excludePrimary: ['assign', 'if', 'else', 'endif', 'jump', 'anchor'],
    objectTypes: ['switch'],
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