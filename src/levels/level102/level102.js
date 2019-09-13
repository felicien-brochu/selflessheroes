/* length: 4
a:
take(here)
step(s)
drop(here)
jump a
*/

/* speed: 29
a:
step(s)
if s != egg :
	jump a
endif
take(s)
b:
step(s)
step(s)
if s != cauldron :
	jump b
endif
drop(s)
*/

const winCondition = {
  step() {},

  check() {
    const cauldronIDs = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109]
    for (let id of cauldronIDs) {
      let cauldron = this.world.findWorldObjectByID(id)
      if (!cauldron || cauldron.items.length < 1) {
        return false
      }
    }
    return true
  },

  getReason() {
    return 'reason_custom'
  }
}

const level = {
  name: {
    en: "Dinner's ready!",
    fr: "À table !",
  },
  objective: {
    en: "These %%icon icon-egg$%% eggs were randomly scattered throughout the room. Put them into the %%icon icon-cauldron$%% cauldrons.",
    fr: "Ces %%icon icon-egg$%% œufs ont été éparpillés au hasard dans la pièce. Mets-les dans les %%icon icon-cauldron$%% chaudrons.",
  },
  startingCode: "",
  startingEditorType: "graph",
  maxStep: 400,
  speedTarget: 29,
  lengthTarget: 4,

  compilerConfig: {
    excludePrimary: ['assign'],
    variables: 0,
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg', 'cauldron'],
    valueFunctions: [],
    actionFunctions: ['step_once', 'take', 'drop'],
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'integer']
  },

  ruleset: {
    win: winCondition,
    lose: 'default_loss'
  },

  worldGenerator: {
    type: 'eggs_matrix',
    config: {
      originMarkerID: 99,
      width: 10,
      height: 8,

      strategy: {
        type: 'random_columns',
        minEggs: 1,
        maxEggs: 1,
        eggConfig: {
          value: 'rng(0,9)'
        }
      }
    }
  }
}

export default level