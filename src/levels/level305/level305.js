import map from './map305.json'

function findTargetEgg(world) {
  let xEgg = world.eggs.find(egg => egg.y === 2)
  let yEgg = world.eggs.find(egg => egg.x === 2)
  return world.eggs.find(egg => egg.x === xEgg.value + 2 && egg.y === yEgg.value + 2).shallowCopy()
}

const winCondition = {
  beforeStart() {
    this.targetEgg = findTargetEgg(this.world)
  },

  check() {
    let cauldronContent = this.world.cauldrons[0].items
    return cauldronContent.length === 1 && cauldronContent[0].id === this.targetEgg.id
  }
}

const tookWrongEggCondition = {
  beforeStart() {
    this.targetEgg = findTargetEgg(this.world)
  },

  check() {
    return this.world.heroes.some(hero => hero.item && hero.item.id !== this.targetEgg.id)
  },

  getReason() {
    return 'loss_reason_took_wrong_egg'
  }
}

const tooMuchHeroesCondition = {
  check() {
    return this.world.heroes.length > 50
  },

  getReason() {
    return 'loss_reason_too_mush_heroes'
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Lottery\u00A02",
    fr: "Loterie\u00A02",
  },
  objective: {
    en: "The number on the %%icon icon-egg$%% egg to the right of the %%icon icon-cauldron$%% cauldron indicates the number of the column of the egg to put into the %%icon icon-cauldron$%% cauldron.\nThe number on the %%icon icon-egg$%% egg below the %%icon icon-cauldron$%% cauldron indicates the number of the row.\n\n%%icon mdi mdi-alert-octagon-outline$%%Maximum number of heroes: 50",
    fr: "Le nombre sur l'%%icon icon-egg$%% œuf à droite du %%icon icon-cauldron$%% chaudron indique le numéro de la colonne de l'œuf à mettre dans le %%icon icon-cauldron$%% chaudron.\nLe nombre sur l'%%icon icon-egg$%% œuf en-dessous du %%icon icon-cauldron$%% chaudron indique le numéro de la ligne.\n\n%%icon mdi mdi-alert-octagon-outline$%%Nombre maximum de héros\u00A0: 50",
  },

  messages: {
    loss_reason_took_wrong_egg: {
      en: "One of the heroes took the wrong egg",
      fr: "Un des héros a pris le mauvais œuf"
    },
    loss_reason_too_mush_heroes: {
      en: "The maximum number of heroes has been exceeded.\nMaximum number of heroes: 50",
      fr: "Le nombre maximum de héros a été dépassé.\nNombre de héros maximum\u00A0: 50"
    },
  },

  maxStep: 200,
  speedTarget: 47,
  lengthTarget: 11,

  compilerConfig: {
    excludePrimary: [],
    cloneIsDeadly: false,
    terrainTypes: ['floor', 'wall'],
    objectTypes: ['hero', 'egg', 'cauldron', 'nothing'],
    actionFunctions: ['take', 'drop'],
    valueFunctions: ['set', 'calc', 'nearest'],
    variables: 2,
    leftComparisonExpressions: ['direction', 'myitem', 'variable'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'myitem', 'integer', 'variable']
  },

  ruleset: {
    win: [winCondition],
    lose: [tooMuchHeroesCondition, 'or', tookWrongEggCondition, 'or', 'one_hero_dead', 'or', 'default_loss']
  },

  worldGenerator: [{
    type: 'eggs_matrix',
    config: {
      originMarkerID: 165,
      width: 9,
      height: 9,

      strategy: {
        type: 'simple',
        eggConfig: {
          value: 'rng(1,9)',
        }
      }
    }
  }]
}

export default level