import map from './map013.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level013-messages-${language}.json`)
}

function isOnCross(world, hero) {
  return world.symbols.some(s => s.symbol === 'cross' && s.overlaps(hero))
}

const winCondition = {
  check(world) {
    return world.heroes.every(h => isOnCross(world, h))
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
    this.newIsOnCrossMap = this.heroes.map(h => isOnCross(world, world.findWorldObjectByID(h.id)))
  },

  check(world) {
    return this.newIsOnCrossMap.some((onCross, i) => !onCross && this.isOnCrossMap[i])
  },

  getReason(world) {
    return 'loss_reason_moved_of_the_cross'
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 100,
  speedTarget: 19,
  lengthTarget: 6,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['hero', 'nothing'],
    actionFunctions: ['step'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: winCondition,
    lose: [movedOfTheCrossLossCondition, 'or', 'default_loss']
  }
}

export default level