import map from './map302.json'

const winCondition = {
  beforeStart() {
    this.heroes = this.world.heroes.slice().map(hero => hero.shallowCopy())
  },

  check() {
    const startY = this.heroes[0].y
    return this.world.heroes.every(hero => {
      let startHero = this.heroes.find(h => h.id === hero.id)
      return hero.y === startY + 2 && hero.x === startHero.x
    })
  },
}


const movedOfTheCrossLossCondition = {
  beforeStart() {
    this.heroes = this.world.heroes.slice().sort((a, b) => a.x - b.x).map(hero => hero.shallowCopy())
    this.isOnCrossMap = this.heroes.map(h => false)
    this.newIsOnCrossMap = this.isOnCrossMap.slice()
  },

  step() {
    this.isOnCrossMap = this.newIsOnCrossMap.slice()
    for (let i = 0; i < this.heroes.length; i++) {
      let startHero = this.heroes[i]
      let hero = this.world.findWorldObjectByID(this.heroes[i].id)
      this.newIsOnCrossMap[i] = hero.x === startHero.x && hero.y === startHero.y + 2
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


const wrongOrderLossCondition = {
  beforeStart() {
    this.heroes = this.world.heroes.slice().sort((a, b) => a.x - b.x).map(hero => hero.shallowCopy())
    this.isOnCrossMap = this.heroes.map(h => false)
    this.newIsOnCrossMap = this.isOnCrossMap.slice()
  },

  step() {
    this.isOnCrossMap = this.newIsOnCrossMap.slice()
    for (let i = 0; i < this.heroes.length; i++) {
      let startHero = this.heroes[i]
      let hero = this.world.findWorldObjectByID(this.heroes[i].id)
      this.newIsOnCrossMap[i] = hero.x === startHero.x && hero.y === startHero.y + 2
    }
  },

  check() {
    let lastHeroOnCross = -1
    let foundNewHeroOnCross = false

    for (let i = 0; i < this.isOnCrossMap.length; i++) {
      if (this.newIsOnCrossMap[i] && !this.isOnCrossMap[i]) {
        if (lastHeroOnCross < i - 1 || foundNewHeroOnCross) {
          return true
        }
        foundNewHeroOnCross = true
      }
      if (this.newIsOnCrossMap[i]) {
        lastHeroOnCross = i
      }
    }
    return false
  },

  getReason() {
    return 'loss_reason_wrong_order'
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "The grapevine",
    fr: "Téléphone arabe",
  },
  objective: {
    en: "%%icon icon-hero$%% Heroes must go to the crosses one at a time. First the hero on the left, then the hero on his right, etc.",
    fr: "Les %%icon icon-hero$%% héros doivent aller sur les croix l'un après l'autre. D'abord le héros tout à gauche, puis le héro à sa droite etc.",
  },
  messages: {
    loss_reason_moved_of_the_cross: {
      en: "Once a %%icon icon-hero$%% hero has arrived on a cross, he must not move from it",
      fr: "Une fois qu'un %%icon icon-hero$%% héro est arrivé sur une croix, il ne doit plus en bouger",
    },
    loss_reason_wrong_order: {
      en: "%%icon icon-hero$%% Heroes must take turns going to the crosses. The hero on the far left must be the first to go, then the hero on his right, and so on until the hero on the far right.",
      fr: "Les %%icon icon-hero$%% héros doivent aller sur les croix chacuns leur tour. Le héro tout à gauche doit être le premier à y aller, puis le héro à sa droite, ainsi de suite jusqu'au héro tout à droite.",
    },
  },

  maxStep: 40,
  speedTarget: 11,
  lengthTarget: 5,

  compilerConfig: {
    excludePrimary: ['clone', 'jump', 'anchor'],
    terrainTypes: ['floor', 'wall'],
    objectTypes: [],
    actionFunctions: ['step_once', 'tell', 'listen'],
    valueFunctions: [],
    variables: 0,
    messages: 8,
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['terrain_type'],
    forbiddenExpressions: ['everyone']
  },

  ruleset: {
    win: winCondition,
    lose: [movedOfTheCrossLossCondition, 'or', wrongOrderLossCondition, 'or', 'default_loss']
  },
}

export default level