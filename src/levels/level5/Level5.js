/* speed: 4, length: 7
if n == switch :
	step(n)
endif
if e == switch :
	step(e)
endif
if s == switch :
	step(s)
endif
step(w)
*/

const level = {
  name: {
    en: "Vertigo",
    fr: "Vertige",
  },
  objective: {
    en: "Trigger all the %%icon icon-switch$%% switches",
    fr: "Active tous les %%icon icon-switch$%% boutons",
  },
  startingCode: "",
  startingEditorType: "graph",
  maxStep: 100,
  speedTarget: 4,
  lengthTarget: 7,

  compilerConfig: {
    excludePrimary: ['assign', 'jump', 'anchor'],
    variables: 0,
    terrainTypes: ['hole', 'floor'],
    objectTypes: ['switch', 'nothing'],
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