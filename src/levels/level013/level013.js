import map from './map013.json'

const winCondition = {
  beforeStart() {
    this.heroes = this.world.heroes.slice().sort((a, b) => a.x - b.x).map(hero => hero.shallowCopy())
  },

  check() {
    const startY = this.heroes[0].y
    let dy = 1
    for (let i = 0; i < this.heroes.length; i++) {
      let startHero = this.heroes[i]
      let hero = this.world.findWorldObjectByID(startHero.id)
      if (hero.x !== startHero.x || hero.y !== startHero.y + dy) {
        return false
      }
      dy = -dy
    }
    return true
  },
}


const movedOfTheCrossLossCondition = {
  beforeStart() {
    this.heroes = this.world.heroes.slice().sort((a, b) => a.x - b.x).map(hero => hero.shallowCopy())
    this.isOnCrossMap = this.heroes.map(h => false)
    this.newIsOnCrossMap = this.isOnCrossMap.slice()
  },

  step() {
    let dy = 1
    this.isOnCrossMap = this.newIsOnCrossMap.slice()
    for (let i = 0; i < this.heroes.length; i++) {
      let startHero = this.heroes[i]
      let hero = this.world.findWorldObjectByID(this.heroes[i].id)
      this.newIsOnCrossMap[i] = hero.x === startHero.x && hero.y === startHero.y + dy
      dy = -dy
    }
  },

  check() {
    for (let i = 0; i < this.isOnCrossMap.length; i++) {
      if (!this.newIsOnCrossMap[i] && this.isOnCrossMap[i]) {
        return true
      }
    }
    return false
  },

  getReason() {
    return 'loss_reason_moved_of_the_cross'
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Ups and downs",
    fr: "Des hauts et des bas",
  },
  objective: {
    en: "%%icon icon-hero$%% Heroes must go to the crosses",
    fr: "Les %%icon icon-hero$%% héros doivent aller sur les croix",
  },
  messages: {
    loss_reason_moved_of_the_cross: {
      en: "Once a %%icon icon-hero$%% hero has arrived on a cross, he must not move from it",
      fr: "Une fois qu'un %%icon icon-hero$%% héro est arrivé sur une croix, il ne doit plus en bouger",
    },
  },

  maxStep: 100,
  speedTarget: 19,
  lengthTarget: 6,

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['hero', 'nothing'],
    actionFunctions: ['step_once'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: winCondition,
    lose: [movedOfTheCrossLossCondition, 'or', 'default_loss']
  }
}

export default level