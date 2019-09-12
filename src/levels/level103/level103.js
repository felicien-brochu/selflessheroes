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
    en: "Put the %%icon icon-egg$%% egg in the %%icon icon-cauldron$%% cauldron",
    fr: "Mets l'%%icon icon-egg$%% œuf dans le %%icon icon-cauldron$%% chaudron",
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
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['terrain_type', 'object_type', 'integer']
  },

  ruleset: {
    win: [{
      type: 'eggs_in_cauldrons',
      config: {
        eggCauldronMap: [{
          eggs: [26],
          cauldron: 30
        }]
      }
    }],
    lose: 'default_loss'
  }
}

export default level