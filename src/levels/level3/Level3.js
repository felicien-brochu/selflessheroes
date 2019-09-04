/* speed: 2, length: 3
if e == switch :
	step(e)
endif
step(w)
*/

const level = {
  name: {
    en: "Watch the step",
    fr: "Attention à la marche",
  },
  objective: {
    en: "Trigger all the %%icon icon-switch$%% switches",
    fr: "Active tous les %%icon icon-switch$%% boutons",
  },
  startingCode: "if e == switch:\n\tstep(e)\nendif\n",
  startingEditorType: "graph",
  maxStep: 100,
  speedTarget: 2,
  lengthTarget: 3,

  compilerConfig: {
    excludePrimary: ['assign', 'jump', 'anchor'],
    variables: 0,
    terrainTypes: ['hole'],
    objectTypes: ['switch'],
    valueFunctions: [],
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