import map from './map302.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level302-messages-${language}.json`)
}

const winCondition = {
  beforeStart(world) {
    this.heroes = world.heroes.slice().map(hero => hero.shallowCopy())
  },

  check(world) {
    const startY = this.heroes[0].y
    return world.heroes.every(hero => {
      let startHero = this.heroes.find(h => h.id === hero.id)
      return hero.y === startY + 2 && hero.x === startHero.x
    })
  },
}


const movedOfTheCrossLossCondition = {
  beforeStart(world) {
    this.heroes = world.heroes.slice().sort((a, b) => a.x - b.x).map(hero => hero.shallowCopy())
    this.isOnCrossMap = this.heroes.map(h => false)
    this.newIsOnCrossMap = this.isOnCrossMap.slice()
  },

  step(world) {
    this.isOnCrossMap = this.newIsOnCrossMap.slice()
    for (let i = 0; i < this.heroes.length; i++) {
      let startHero = this.heroes[i]
      let hero = world.findWorldObjectByID(this.heroes[i].id)
      this.newIsOnCrossMap[i] = hero.x === startHero.x && hero.y === startHero.y + 2
    }
  },

  check(world) {
    for (let i = 0; i < this.isOnCrossMap.length; i++) {
      if (!this.newIsOnCrossMap[i] && this.isOnCrossMap[i]) {
        return true
      }
    }
    return false
  },

  getReason(world) {
    return 'loss_reason_moved_of_the_cross'
  }
}


const wrongOrderLossCondition = {
  beforeStart(world) {
    this.heroes = world.heroes.slice().sort((a, b) => a.x - b.x).map(hero => hero.shallowCopy())
    this.isOnCrossMap = this.heroes.map(h => false)
    this.newIsOnCrossMap = this.isOnCrossMap.slice()
  },

  step(world) {
    this.isOnCrossMap = this.newIsOnCrossMap.slice()
    for (let i = 0; i < this.heroes.length; i++) {
      let startHero = this.heroes[i]
      let hero = world.findWorldObjectByID(this.heroes[i].id)
      this.newIsOnCrossMap[i] = hero.x === startHero.x && hero.y === startHero.y + 2
    }
  },

  check(world) {
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

  getReason(world) {
    return 'loss_reason_wrong_order'
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 40,
  speedTarget: 11,
  lengthTarget: 5,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['clone', 'jump', 'anchor'],
    terrainTypes: ['floor', 'wall'],
    objectTypes: [],
    actionFunctions: ['step', 'tell', 'listen'],
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