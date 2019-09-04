/* speed: 71
if s == bonfire :
	a:
	fireball(s)
	step(e)
	jump a
else
	b:
	fireball(n)
	step(e)
	jump b
endif
*/

/* length: 4
a:
fireball(s)
fireball(n)
step(e)
jump a
*/

const level = {
  name: {
    en: "Candlelight vigil",
    fr: "Veillée aux flambeaux",
  },
  objective: {
    en: "Lit all %%icon icon-bonfire$%% bonfires\n\n%%icon mdi mdi-information-outline$%% Use %%statement branching-statement$jump%% to repeat actions",
    fr: "Allume tous les %%icon icon-bonfire$%% feux\n\n%%icon mdi mdi-information-outline$%% Utilise %%statement branching-statement$saut%% pour répéter des actions en boucle",
  },
  startingCode: "a:\nstep(e)\njump a\n",
  startingEditorType: "graph",
  maxStep: 200,
  speedTarget: 71,
  lengthTarget: 4,

  compilerConfig: {
    excludePrimary: ['assign'],
    variables: 0,
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['bonfire'],
    valueFunctions: [],
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