/* length: 9
a:
b:
step(s)
if s != cauldron :
	jump b
endif
drop(s)
c:
if n >= 4 ||
  n != egg :
	step(n)
	jump c
endif
take(n)
jump a
*/

/* speed: 132
step(s)
a:
step(s)
d:
if here >= 4 :
	jump a
endif
take(here)
b:
step(s)
step(s)
if s != cauldron :
	jump b
endif
drop(s)
c:
step(n)
if n == egg :
	jump c
endif
jump d
*/

const winCondition = {
  beforeStart() {
    this.selectedEggs = this.world.eggs.filter(egg => egg.value < 4).map(egg => egg.shallowCopy())
  },

  check() {
    const cauldronIDs = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109]
    let targetEggs = this.selectedEggs.map(egg => egg.id).sort()
    let cauldronEggs = []

    for (let id of cauldronIDs) {
      let cauldron = this.world.findWorldObjectByID(id)
      cauldronEggs = cauldronEggs.concat(cauldron.items.map(item => item.id))
    }

    if (cauldronEggs.length !== targetEggs.length) {
      return false
    }

    cauldronEggs.sort()
    for (let i = 0; i < cauldronEggs.length; i++) {
      if (cauldronEggs[i] !== targetEggs[i]) {
        return false
      }
    }
    return true
  }
}

const wrongNumberEggLossCondition = {
  check() {
    const cauldronIDs = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109]
    for (let id of cauldronIDs) {
      let cauldron = this.world.findWorldObjectByID(id)

      for (let item of cauldron.items) {
        if (cauldron && item.value >= 4) {
          return true
        }
      }
    }
    return false
  },

  getReason() {
    return 'loss_reason_one_egg_ge_4'
  }
}

const level = {
  name: {
    en: "Harvest",
    fr: "Récolte",
  },
  objective: {
    en: "Put all the %%icon icon-egg$%% eggs which are less than 4\ninto the %%icon icon-cauldron$%% cauldrons",
    fr: "Mets tous les %%icon icon-egg$%% œufs inférieurs à 4\ndans les %%icon icon-cauldron$%% chaudrons",
  },
  messages: {
    loss_reason_one_egg_ge_4: {
      en: "You put an %%icon icon-egg$%% egg greater or equal to 4\nin a %%icon icon-cauldron$%% cauldron",
      fr: "Tu as mis un %%icon icon-egg$%% œuf supérieur ou égal à 4\ndans un %%icon icon-cauldron$%% chaudron",
    }
  },

  startingCode: "",
  startingEditorType: "graph",
  maxStep: 1000,
  speedTarget: 144,
  lengthTarget: 9,

  compilerConfig: {
    excludePrimary: ['assign'],
    variables: 0,
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg', 'cauldron', 'nothing'],
    valueFunctions: [],
    actionFunctions: ['step_once', 'take', 'drop'],
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'integer']
  },

  ruleset: {
    win: [winCondition],
    lose: [wrongNumberEggLossCondition, 'or', 'default_loss']
  },

  worldGenerator: [{
    type: 'eggs_matrix',
    config: {
      originMarkerID: 99,
      width: 10,
      height: 8,

      strategy: {
        type: 'random_columns',
        minEggs: 8,
        maxEggs: 8,
        eggConfig: {
          value: 'rng(0,9)',
          showLottery: true
        }
      }
    }
  }]
}

export default level