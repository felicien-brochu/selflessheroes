/* length: 5
a:
take(w)
take(n)
drop(e)
drop(s)
jump a
*/

/* speed: 22
if n == wall &&
  s == wall :
	a:
	take(w)
	drop(e)
	jump a
else
	if w == wall &&
	  e == wall :
		b:
		take(n)
		drop(s)
		jump b
	else
		c:
		take(w)
		drop(s)
		jump c
	endif
endif
*/

const level = {
  name: {
    en: "Human chain",
    fr: "Chaîne humaine",
  },
  objective: {
    en: "Put the %%icon icon-egg$%% egg on the cross",
    fr: "Dépose l'œuf sur la croix",
  },
  startingCode: "",
  startingEditorType: "graph",
  maxStep: 100,
  speedTarget: 22,
  lengthTarget: 5,

  compilerConfig: {
    excludePrimary: ['assign'],
    variables: 0,
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg'],
    valueFunctions: [],
    actionFunctions: ['take', 'drop'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['terrain_type', 'object_type']
  },

  ruleset: {
    win: [{
      type: 'egg_on_marker',
      config: {
        eggMarkerMap: [{
          egg: 26,
          marker: 27
        }]
      }
    }],
    lose: 'default_loss'
  }
}

export default level