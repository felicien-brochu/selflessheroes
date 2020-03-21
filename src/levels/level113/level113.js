import map from './map113.json'
import enMessages from './level113-messages-en.json'
import frMessages from './level113-messages-fr.json'

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
  messages: {
    en: enMessages,
    fr: frMessages
  },

  maxStep: 500,
  speedTarget: 100,
  lengthTarget: 5,

  bossTellsSomething: true,
  bossName: "pied-piper",

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
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