import map from './map113.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level113-messages-${language}.json`)
}

const winCondition = {
  beforeStart(world) {
    this.max = world.eggs.reduce((acc, egg) => Math.max(egg.value, acc), 0)
  },

  check(world) {
    let remainingEggs = world.eggs.filter(egg => !egg.removed)
    return remainingEggs.length === 1 && remainingEggs[0].value === this.max
  },
}

const allHeroEndedLossCondition = {
  beforeStart(world) {
    this.max = world.eggs.reduce((acc, egg) => Math.max(egg.value, acc), 0)
  },

  check(world) {
    let remainingEggs = world.eggs.filter(egg => !egg.removed)
    let hasWon = remainingEggs.length === 1 && remainingEggs[0].value === this.max

    let ended = true
    for (let hero of world.heroes.filter(h => !h.dead)) {
      ended &= hero.getDebugContext().ended
    }
    return ended && !hasWon
  },

  getReason(world) {
    return 'loss_reason_all_hero_ended'
  }
}

const allMaxEggsInHoleLossCondition = {
  beforeStart(world) {
    const max = world.eggs.reduce((acc, egg) => Math.max(egg.value, acc), 0)
    this.maxEggs = world.eggs.filter(egg => egg.value === max)
  },

  check(world) {
    return this.maxEggs.every(egg => egg.removed)
  },

  getReason(world) {
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
  messages: messages,

  maxStep: 500,
  speedTarget: 100,
  lengthTarget: 5,

  bossTellsSomething: true,
  bossName: "pied-piper",

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
    terrainTypes: ['wall', 'hole', 'floor'],
    objectTypes: ['hero', 'nothing'],
    actionFunctions: ['step'],
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['direction', 'object_type', 'terrain_type', 'myitem']
  },

  ruleset: {
    win: [winCondition],
    lose: [allMaxEggsInHoleLossCondition, 'or', allHeroEndedLossCondition, 'or', 'too_many_steps', 'or', 'all_hero_dead']
  },

  worldGenerator: worldGenerator,
}

export default level