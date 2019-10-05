import map from './map113.json'

const winCondition = {
  beforeStart() {
    this.max = this.world.eggs.reduce((acc, egg) => Math.max(egg.value, acc), 0)
  },

  check() {
    let remainingEggs = this.world.eggs.filter(egg => !egg.removed)
    return remainingEggs.length === 1 && remainingEggs[0].value === this.max
  },
}

const allMaxEggsInHoleLossCondition = {
  beforeStart() {
    const max = this.world.eggs.reduce((acc, egg) => Math.max(egg.value, acc), 0)
    this.maxEggs = this.world.eggs.filter(egg => egg.value === max)
  },

  check() {
    return this.maxEggs.every(egg => egg.removed)
  },

  getReason() {
    return 'loss_reason_all_max_eggs_in_hole'
  }
}

const worldGenerator = {
  generate(world) {
    const heroesOriginMarker = world.findConfigObjectByID(99)
    const width = 7
    const height = 4
    let max = 0
    for (let y = heroesOriginMarker.y; y < heroesOriginMarker.y + height; y++) {
      for (let x = heroesOriginMarker.x; x < heroesOriginMarker.x + width; x++) {
        let value = Math.floor(world.rng() * 100)
        max = Math.max(value, max)

        let eggConfig = {
          id: world.getAvailableObjectID(),
          x: x,
          y: y,
          value: value,
          lottery: "rng(0,99)",
          showLottery: true,
        }
        world.createObject('egg', eggConfig)
        world.createObject('hero', {
          id: world.getAvailableObjectID(),
          x: x,
          y: y,
          item: eggConfig.id,
        })
      }
    }

    // Duplicate max egg
    let maxEggs = world.eggs.filter(egg => egg.value === max)
    if (maxEggs.length < 2) {
      let maxEgg = maxEggs[0]
      let x, y
      do {
        x = Math.floor(world.rng() * width) + heroesOriginMarker.x
        y = Math.floor(world.rng() * height) + heroesOriginMarker.y
      } while (x === maxEgg.x && y === maxEgg.y)

      let newMaxEgg = world.eggs.find(egg => egg.x === x && egg.y === y)
      newMaxEgg.value = max
    }
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Pied Piper",
    fr: "Pied Piper",
  },
  objective: {
    en: "The Pied Piper draws your %%icon icon-hero$%% heroes to the precipice. Only the bravest will survive.\n\nThrow all the %%icon icon-hero$%% heroes into the hole except the one with the %%icon icon-egg$%% egg of maximum value.\n\n%%icon mdi mdi-information-outline$%% If several heroes have an %%icon icon-egg$%% egg of maximum value, only one must survive.",
    fr: "Le joueur de flûte attire vos %%icon icon-hero$%% héros vers le précipice. Seul le plus valeureux survivra.\n\nFais tomber tous les %%icon icon-hero$%% héros dans le trou excepté celui qui a l'%%icon icon-egg$%%œuf de valeur maximale.\n\n%%icon mdi mdi-information-outline$%% Si plusieurs héros ont un %%icon icon-egg$%% œuf de valeur maximale, un seul doit survivre.",
  },
  messages: {
    loss_reason_all_max_eggs_in_hole: {
      en: "All the %%icon icon-hero$%% heroes who had the %%icon icon-egg$%% egg of maximum value threw themselves into the hole",
      fr: "Tous les %%icon icon-hero$%% héros qui avaient l'%%icon icon-egg$%%œuf de valeur maximale se sont jetés dans le trou",
    },
  },

  maxStep: 500,
  speedTarget: 100,
  lengthTarget: 5,

  compilerConfig: {
    excludePrimary: ['assign'],
    terrainTypes: ['wall', 'hole', 'floor'],
    objectTypes: ['hero', 'nothing'],
    actionFunctions: ['step_once'],
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['direction', 'object_type', 'terrain_type', 'myitem']
  },

  ruleset: {
    win: [winCondition],
    lose: [allMaxEggsInHoleLossCondition, 'or', 'default_loss']
  },

  worldGenerator: worldGenerator,
}

export default level