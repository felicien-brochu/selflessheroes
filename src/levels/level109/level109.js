/* length: 4
a:
if w > myitem :
	step(w)
endif
step(e)
jump a
*/

/* speed: 23.7065
a:
if w > myitem :
	step(w)
else
	step(e)
endif
jump a
*/

const winCondition = {
  beforeStart() {
    this.eggsByValue = this.world.eggs.slice().sort((a, b) => a.value - b.value)
  },

  check() {
    let eggsByX = this.world.eggs.slice().sort((a, b) => a.owner.x - b.owner.x)
    return eggsByX.every((egg, i) => egg.value === this.eggsByValue[i].value)
  },
}

const level = {
  name: {
    en: "Everyone in place",
    fr: "Chacun sa place",
  },
  objective: {
    en: "Sort the %%icon icon-hero$%% heroes from smallest on the left to largest on the right\n\n%%icon mdi mdi-information-outline$%% Heroes can switch places when they go in opposite directions at the same time",
    fr: "Trie les %%icon icon-hero$%% héros du plus petit à gauche au plus grand à droite\n\n%%icon mdi mdi-information-outline$%% Les héros peuvent échanger de place quand ils vont dans des directions opposées au même moment",
  },

  startingCode: "",
  startingEditorType: "graph",
  maxStep: 400,
  speedTarget: 27,
  lengthTarget: 4,

  compilerConfig: {
    excludePrimary: ['assign'],
    variables: 0,
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['hero', 'egg', 'nothing'],
    valueFunctions: [],
    actionFunctions: ['step_once'],
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'direction', 'myitem']
  },

  ruleset: {
    win: [winCondition],
    lose: ['default_loss']
  }
}

export default level