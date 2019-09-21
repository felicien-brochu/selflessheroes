import map from './map111.json'

/* length: 11
take(s)
step(s)
step(s)
step(s)
b:
if here != myitem :
	if here > myitem :
		step(w)
	else
		step(e)
	endif
	jump b
endif
drop(s)
*/

/* speed: 34.05
take(s)
step(s)
step(s)
if s != myitem :
	if s > myitem :
		a:
		if sw != myitem :
			step(w)
			jump a
		endif
		c:
		step(sw)
		if s != cauldron :
			jump c
		endif
	else
		b:
		if se != myitem :
			step(e)
			jump b
		endif
		d:
		step(se)
		if s != cauldron :
			jump d
		endif
	endif
else
	step(s)
endif
drop(s)
*/

const winCondition = {
  beforeStart() {
    let eggsOriginMarker = this.world.findConfigObjectByID(99)
    this.targetEggs = this.world.eggs.filter(egg => egg.y === eggsOriginMarker.y)
  },

  check() {
    if (!this.targetEggs.every(egg => egg.removed)) {
      return false
    }

    let i = 0
    for (let cauldron of this.world.cauldrons) {
      if (!cauldron.items.every(item => item.value === i)) {
        return false
      }
      i++
    }
    return true
  },
}

const wrongEggInCauldronLossCondition = {
  check() {
    let i = 0
    for (let cauldron of this.world.cauldrons) {
      if (!cauldron.items.every(item => item.value === i)) {
        return true
      }
      i++
    }
    return false
  },

  getReason() {
    return 'loss_reason_wrong_egg_in_cauldron'
  }
}

const tookLabelEggLossCondition = {
  beforeStart() {
    let labelEggOrigin = this.world.findWorldObjectByID(120)
    this.labelEggs = this.world.eggs.filter(egg => egg.y === labelEggOrigin.y)
  },

  check() {
    return !this.labelEggs.every(egg => !egg.owner)
  },

  getReason() {
    return 'loss_reason_took_label_egg'
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Cross-delivery",
    fr: "Livraison croisée",
  },
  objective: {
    en: "The %%icon icon-cauldron$%% cauldrons are labelled from 0 to 9 by the eggs in front of them. Put the %%icon icon-egg$%% eggs that are in front of the heroes into the corresponding %%icon icon-cauldron$%% cauldrons.",
    fr: "Les %%icon icon-cauldron$%% chaudrons sont numérotés de 0 à 9 par les œufs devant eux. Mets les %%icon icon-egg$%% œufs qui sont devant les héros dans les %%icon icon-cauldron$%% chaudrons correspondants.",
  },
  messages: {
    loss_reason_took_label_egg: {
      en: "Don't move the %%icon icon-egg$%% eggs used to label the %%icon icon-cauldron$%% cauldrons",
      fr: "Ne déplace pas les %%icon icon-egg$%% œufs qui servent à numéroter les %%icon icon-cauldron$%% chaudrons",
    },
    loss_reason_wrong_egg_in_cauldron: {
      en: "You put an %%icon icon-egg$%% egg in the wrong %%icon icon-cauldron$%% cauldron\n\n.The %%icon icon-cauldron$%% cauldrons are labelled from 0 to 9 by the eggs in front of them. Put the %%icon icon-egg$%% eggs into the %%icon icon-cauldron$%% cauldrons of same value.",
      fr: "Tu as mis un %%icon icon-egg$%% œuf dans le mauvais %%icon icon-cauldron$%% chaudron.\n\nLes %%icon icon-cauldron$%% chaudrons sont numérotés de 0 à 9 par les œufs devant eux. Mets les %%icon icon-egg$%% œufs dans les %%icon icon-cauldron$%% chaudrons qui sont de la même valeur.",
    }
  },

  startingCode: "",
  startingEditorType: "graph",
  maxStep: 200,
  speedTarget: 37,
  lengthTarget: 11,

  compilerConfig: {
    excludePrimary: ['assign'],
    variables: 0,
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg', 'cauldron', 'hero', 'nothing'],
    valueFunctions: [],
    actionFunctions: ['step_once', 'take', 'drop'],
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['direction', 'object_type', 'terrain_type', 'myitem']
  },

  ruleset: {
    win: [winCondition],
    lose: [wrongEggInCauldronLossCondition, 'or', tookLabelEggLossCondition, 'or', 'default_loss']
  },

  worldGenerator: {
    type: 'eggs_matrix',
    config: {
      originMarkerID: 99,
      width: 10,
      height: 1,

      strategy: {
        type: 'random_columns',
        minEggs: 1,
        maxEggs: 1,
        eggConfig: {
          value: 'rng(0,9)',
          showLottery: true,
        }
      }
    }
  }
}

export default level