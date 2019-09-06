/* length: 4
a:
take(here)
step(s)
drop(here)
jump a
*/

/* speed: 31
a:
step(s)
if s != egg :
	jump a
endif
take(s)
b:
step(s)
step(s)
if s != wall :
	jump b
endif
drop(here)
*/

const winCondition = {
  step() {},

  check() {
    const markerIDs = [43, 44, 45, 46, 47, 48, 49, 50, 51, 52]
    for (let id of markerIDs) {
      let marker = this.world.findConfigObjectByID(id)
      if (!marker) {
        return false
      }

      let objects = this.world.getWorldObjectsAt(marker.x, marker.y)
      let egg = objects.find(obj => obj.getObjectType() === 'egg' && !obj.owner)
      if (!egg) {
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
    en: "Tidying up",
    fr: "Un peu de rangement",
  },
  objective: {
    en: "These %%icon icon-egg$%% eggs were randomly scattered throughout the room. Put them on the crosses to tidy up.",
    fr: "Ces %%icon icon-egg$%% œufs ont été éparpillés au hasard dans la pièce. Mets-les sur les croix pour les ranger.",
  },
  startingCode: "",
  startingEditorType: "graph",
  maxStep: 140,
  speedTarget: 31,
  lengthTarget: 4,

  compilerConfig: {
    excludePrimary: ['assign'],
    variables: 0,
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg'],
    valueFunctions: [],
    actionFunctions: ['step_once', 'take', 'drop'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: [winCondition],
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