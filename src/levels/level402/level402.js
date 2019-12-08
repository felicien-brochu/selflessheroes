import map from './map402.json'

const winCondition = {
  beforeStart() {
    const map = this.world.map
    this.floor = []
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        if (map.isFloor(x, y)) {
          this.floor.push([x, y])
        }
      }
    }
  },

  check() {
    return this.floor.every(cell => cell[0] % 2 !== cell[1] % 2 || this.world.getCharactersAt(cell[0], cell[1]).length > 0)
  }
}

const tooMuchHeroesCondition = {
  check() {
    return this.world.heroes.length > 10
  },

  getReason() {
    return 'loss_reason_too_mush_heroes'
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Nuclear button",
    fr: "Bouton nucléaire",
  },
  objective: {
    en: "Trigger all the %%icon icon-switch$%% switches.\n\n%%icon mdi mdi-alert-octagon-outline$%%Maximum number of heroes: 10",
    fr: "Active tous les %%icon icon-switch$%% boutons.\n\n%%icon mdi mdi-alert-octagon-outline$%%Nombre maximum de héros\u00A0: 10",
  },

  messages: {
    loss_reason_too_mush_heroes: {
      en: "The maximum number of heroes has been exceeded.\nMaximum number of heroes: 10",
      fr: "Le nombre maximum de héros a été dépassé.\nNombre de héros maximum\u00A0: 10"
    },
  },

  maxStep: 200,
  speedTarget: 27,
  lengthTarget: 6,

  compilerConfig: {
    excludePrimary: [],
    terrainTypes: ['floor', 'wall'],
    objectTypes: ['hero', 'switch', 'spikes', 'nothing'],
    actionFunctions: ['step_once'],
    valueFunctions: [],
    variables: 0,
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: ['all_switches'],
    lose: [tooMuchHeroesCondition, 'or', 'one_hero_dead', 'or', 'default_loss']
  },
}

export default level