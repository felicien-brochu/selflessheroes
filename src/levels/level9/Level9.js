import map from './map9.json'

/* speed: 62, length: 8
a:
step(e)
fireball(e)
if e == hole :
	if ne == floor :
		step(ne)
	else
		step(se)
	endif
endif
jump a
*/
/* length: 7
a:
fireball(e)
if ne == floor &&
  n == floor :
	step(ne)
endif
if se == floor &&
  s == floor :
	step(se)
endif
step(e)
jump a
*/

const level = {
  mapConfig: map,
  name: {
    en: "Winding path",
    fr: "Chemin sinueux",
  },
  objective: {
    en: "Lit all %%icon icon-bonfire$%% bonfires",
    fr: "Allume tous les %%icon icon-bonfire$%% feux",
  },

  maxStep: 200,
  speedTarget: 62,
  lengthTarget: 8,

  compilerConfig: {
    excludePrimary: ['assign'],
    terrainTypes: ['hole', 'floor', 'wall'],
    objectTypes: ['bonfire', 'nothing'],
    actionFunctions: ['step_once', 'fireball'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: 'all_bonfires',
    lose: 'default_loss'
  }
}

export default level