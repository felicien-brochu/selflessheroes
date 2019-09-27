import map from './map112.json'

const winCondition = {
  beforeStart() {
    let eggsOriginMarker = this.world.findConfigObjectByID(99)
    this.targetEggs = this.world.eggs.filter(egg => egg.y < eggsOriginMarker.y + 4)
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
    en: "Lonely delivery boy",
    fr: "Livreur solitaire",
  },
  objective: {
    en: "The %%icon icon-cauldron$%% cauldrons are labelled from 0 to 6 by the eggs in front of them. Put the top %%icon icon-egg$%% eggs into the corresponding %%icon icon-cauldron$%% cauldrons.",
    fr: "Les %%icon icon-cauldron$%% chaudrons sont numérotés de 0 à 6 par les œufs devant eux. Mets les %%icon icon-egg$%% œufs du haut dans les %%icon icon-cauldron$%% chaudrons correspondants.",
  },
  messages: {
    loss_reason_took_label_egg: {
      en: "Don't move the %%icon icon-egg$%% eggs used to label the %%icon icon-cauldron$%% cauldrons, otherwise you will not know into which %%icon icon-cauldron$%% cauldron to put the %%icon icon-egg$%% eggs.",
      fr: "Ne déplace pas les %%icon icon-egg$%% œufs qui servent à numéroter les %%icon icon-cauldron$%% chaudrons, sinon tu ne sauras plus dans quel %%icon icon-cauldron$%% chaudron il faut mettre les %%icon icon-egg$%% œufs.",
    },
    loss_reason_wrong_egg_in_cauldron: {
      en: "You put an %%icon icon-egg$%% egg in the wrong %%icon icon-cauldron$%% cauldron.\n\nThe %%icon icon-cauldron$%% cauldrons are labelled from 0 to 6 by the eggs in front of them. Put the top %%icon icon-egg$%% eggs into the %%icon icon-cauldron$%% cauldrons of same value.",
      fr: "Tu as mis un %%icon icon-egg$%% œuf dans le mauvais %%icon icon-cauldron$%% chaudron.\n\nLes %%icon icon-cauldron$%% chaudrons sont numérotés de 0 à 6 par les œufs devant eux. Mets les %%icon icon-egg$%% œufs du haut dans les %%icon icon-cauldron$%% chaudrons qui sont de la même valeur.",
    }
  },

  maxStep: 8000,
  speedTarget: 1500,
  lengthTarget: 23,

  compilerConfig: {
    excludePrimary: ['assign'],
    terrainTypes: ['hole', 'floor'],
    objectTypes: ['egg', 'cauldron', 'nothing'],
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
      width: 7,
      height: 4,

      strategy: {
        type: 'simple',
        eggConfig: {
          value: 'rng(0,6)',
        }
      }
    }
  }
}

export default level