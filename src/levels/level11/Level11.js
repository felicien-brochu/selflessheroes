/* length: 9
a:
if here != switch :
	step(e)
	jump a
endif
step(n)
step(n)
b:
if ne == floor :
	step(ne)
endif
step(e)
jump b
*/

/* speed: 57
a:
if e != switch :
	step(e)
	step(e)
	jump a
endif
step(e)
step(n)
step(n)
b:
if ne == floor :
	step(ne)
endif
step(e)
step(e)
jump b
*/

const level = {
  name: {
    en: "Be brave, run away!",
    fr: "Courage, fuyons\u00A0!",
  },
  objective: {
    en: "Don't die!\n\nThese two ogres are after you. Get rid of them before they catch up with you.\n\n%%icon mdi mdi-information-outline$%% Use the %%icon icon-switch$%% switches to disable/enable the %%icon icon-spikes$%% spikes.",
    fr: "Ne meurs pas!\n\nCes deux ogres en ont après toi. Débarrasses-en-toi avant qu'ils ne te rattrapent.\n\n%%icon mdi mdi-information-outline$%% Utilise les %%icon icon-switch$%% boutons pour activer/désactiver les %%icon icon-spikes$%% piques.",
  },
  startingCode: "",
  startingEditorType: "graph",
  maxStep: 300,
  speedTarget: 57,
  lengthTarget: 9,

  compilerConfig: {
    excludePrimary: ['assign'],
    variables: 0,
    terrainTypes: ['hole', 'floor', 'wall'],
    objectTypes: ['switch', 'spikes', 'nothing'],
    valueFunctions: [],
    actionFunctions: ['step_once'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['terrain_type', 'object_type']
  },

  ruleset: {
    win: ['all_npc_dead'],
    lose: ['all_hero_dead', 'or', 'one_hero_dead', 'or', 'too_many_steps']
  }
}

export default level