/* speed: 4, length: 6
if e == hero :
	step(w)
	step(w)
	step(w)
endif
step(e)
step(e)
*/

const level = {
  name: {
    en: "Seperate ways",
    fr: "Chacun son chemin",
  },
  objective: {
    en: "Trigger all the %%icon icon-switch$%% switches",
    fr: "Active tous les %%icon icon-switch$%% boutons",
  },
  startingCode: "if e == hero:\n\tstep(w)\nendif\n",
  startingEditorType: "graph",
  maxStep: 100,
  speedTarget: 4,
  lengthTarget: 6,

  compilerConfig: {
    excludePrimary: ['assign', 'jump', 'anchor'],
    variables: 0,
    terrainTypes: [],
    objectTypes: ['hero', 'switch', 'nothing'],
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