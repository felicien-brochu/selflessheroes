/* length: 8
a:
if ne != bonfire :
	if se == floor :
		step(se)
	endif
	if ne == floor :
		step(ne)
	endif
	step(e)
	jump a
endif
fireball(ne)
*/

/* speed: 69
a:
step(e)
if ne != bonfire :
	if e == hole :
		if ne == floor :
			step(ne)
		else
			step(se)
		endif
	endif
	jump a
endif
fireball(ne)
*/

const level = {
  name: {
    en: "Winding path 2",
    fr: "Chemin sinueux 2",
  },
  objective: {
    en: "Lit all %%icon icon-bonfire$%% bonfires\n\n%%icon mdi mdi-alert-octagon-outline$%%Warning: all the characters must survive\n\n\n%%icon mdi mdi-information-outline$%% copy/paste the code from the previous level to go faster",
    fr: "Allume tous les %%icon icon-bonfire$%% feux\n\n%%icon mdi mdi-alert-octagon-outline$%%Attention: aucun personnage ne doit mourir\n\n\n%%icon mdi mdi-information-outline$%% Pour aller plus vite, copie/colle le code du niveau précédent",
  },
  startingCode: "",
  startingEditorType: "graph",
  maxStep: 200,
  speedTarget: 69,
  lengthTarget: 8,

  compilerConfig: {
    excludePrimary: ['assign'],
    variables: 0,
    terrainTypes: ['hole', 'floor', 'wall'],
    objectTypes: ['bonfire', 'nothing'],
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