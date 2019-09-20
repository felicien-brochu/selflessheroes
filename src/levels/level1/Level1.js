import map from './map1.json'

/* speed: 3, length: 3
step(s)
step(s)
step(s)
*/

const level = {
  mapConfig: map,
  name: {
    en: "First steps",
    fr: "Premiers pas",
  },
  objective: {
    en: "Help the heroes to walk on the %%icon icon-switch$%% switches",
    fr: "Aide les personnages à aller sur les %%icon icon-switch$%% boutons",
  },
  startingCode: "step(s)\nstep(s)\n",
  startingEditorType: "graph",
  maxStep: 100,
  speedTarget: 3,
  lengthTarget: 3,
  tutorialConfig: 'basic_tutorial',

  compilerConfig: {
    excludePrimary: ['assign', 'if', 'else', 'endif', 'jump', 'anchor'],
    variables: 0,
    terrainTypes: [],
    objectTypes: ['switch'],
    valueFunctions: [],
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