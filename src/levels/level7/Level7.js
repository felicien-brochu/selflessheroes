/* speed: 4
if w != wall :
	step(sw)
	fireball(s)
else
	step(ne)
	if n == bonfire :
		fireball(n)
	endif
endif
*/

/* length: 5
step(sw)
fireball(s)
step(ne)
if n == bonfire :
	fireball(n)
endif
*/

const level = {
  name: {
    en: "Sharp turn",
    fr: "Virage serré",
  },
  objective: {
    en: "Lit all %%icon icon-bonfire$%% bonfires\n\n%%icon mdi mdi-alert-octagon-outline$%%Warning: all the characters must survive",
    fr: "Allume tous les %%icon icon-bonfire$%% feux\n\n%%icon mdi mdi-alert-octagon-outline$%%Attention: aucun personnage ne doit mourir",
  },
  startingCode: "if w != wall :\n\tstep(w)\nelse\n\tstep(e)\nendif\n",
  startingEditorType: "graph",
  maxStep: 100,
  speedTarget: 4,
  lengthTarget: 5,

  compilerConfig: {
    excludePrimary: ['assign', 'jump', 'anchor'],
    variables: 0,
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['bonfire', 'hero', 'nothing'],
    valueFunctions: [],
    actionFunctions: ['step_once', 'fireball'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: 'all_bonfires',
    lose: ['one_hero_dead', 'or', 'default_loss']
  }
}

export default level