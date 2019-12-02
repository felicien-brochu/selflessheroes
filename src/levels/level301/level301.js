import map from './map301.json'

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

const wrongFloorCellCondition = {
  beforeStart() {
    const map = this.world.map
    this.wrongFloor = []
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        if (map.isFloor(x, y) && x % 2 !== y % 2) {
          this.wrongFloor.push([x, y])
        }
      }
    }
  },

  check() {
    return this.wrongFloor.some(cell => this.world.getCharactersAt(cell[0], cell[1]).length > 0)
  },

  getReason() {
    return 'loss_reason_wrong_floor_cell'
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Space invaders",
    fr: "Space invaders",
  },
  objective: {
    en: "Occupy all the dark squares with your %%icon icon-hero$%% heroes.\n\n%%icon mdi mdi-information-outline$%% Now your heroes are able to %%statement branching-statement$clone%% themselves. Check the help about %%statement branching-statement$clone%% to better understand how it works.",
    fr: "Occupe toutes les cases sombres avec tes %%icon icon-hero$%% héros.\n\n%%icon mdi mdi-information-outline$%% Maintenant les héros savent se cloner. Consulte l'aide à propos de %%statement branching-statement$clone%% pour mieux comprendre comment ça marche.",
  },

  messages: {
    loss_reason_wrong_floor_cell: {
      en: "One of your heroes is on a light square.",
      fr: "Un des heros est sur une case claire."
    },
  },

  maxStep: 100,
  speedTarget: 17,
  lengthTarget: 7,

  compilerConfig: {
    excludePrimary: ['jump'],
    terrainTypes: ['floor', 'hole'],
    objectTypes: ['hero', 'nothing'],
    actionFunctions: [],
    valueFunctions: [],
    variables: 0,
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: [winCondition],
    lose: [wrongFloorCellCondition, 'or', 'one_hero_dead', 'or', 'default_loss']
  },
}

export default level