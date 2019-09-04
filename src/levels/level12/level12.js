/* speed: 247, length: 13
e:
a:
if e == floor :
	step(e)
	jump a
endif
b:
if s == floor :
	step(s)
	jump b
endif
c:
if w == floor :
	step(w)
	jump c
endif
d:
if n == floor :
	step(n)
	jump d
endif
jump e
*/

const level = {
  name: {
    en: "Beat around the bush",
    fr: "Tourne autour du pot",
  },
  objective: {
    en: "Trigger all the %%icon icon-switch$%% switches\n\n%%icon mdi mdi-information-outline$%% Once you triggered a red %%icon icon-switch$%% switch, it stays triggered. Even if you don't stay on it.",
    fr: "Active tous les %%icon icon-switch$%% boutons\n\n%%icon mdi mdi-information-outline$%% Dès qu'un %%icon icon-switch$%% bouton rouge est activé, il le reste. Même si le héro ne reste pas dessus.",
  },
  startingCode: "",
  startingEditorType: "graph",
  maxStep: 2000,
  speedTarget: 247,
  lengthTarget: 13,

  compilerConfig: {
    excludePrimary: ['assign'],
    variables: 0,
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['switch'],
    valueFunctions: [],
    actionFunctions: ['step_once'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['terrain_type', 'object_type']
  },

  ruleset: {
    win: 'all_switches',
    lose: 'default_loss'
  }
}

export default level