import map from './map405.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level405-messages-${language}.json`)
}

function findTargetEgg(world) {
  let xEgg = world.eggs.find(egg => egg.y === 2)
  let yEgg = world.eggs.find(egg => egg.x === 2)
  return world.eggs.find(egg => egg.x === xEgg.value + 2 && egg.y === yEgg.value + 2).shallowCopy()
}

const winCondition = {
  beforeStart(world) {
    this.targetEgg = findTargetEgg(world)
  },

  check(world) {
    let cauldronContent = world.cauldrons[0].items
    return cauldronContent.length === 1 && cauldronContent[0].id === this.targetEgg.id
  }
}

const tookWrongEggCondition = {
  beforeStart(world) {
    this.targetEgg = findTargetEgg(world)
  },

  check(world) {
    return world.heroes.some(hero => hero.item && hero.item.id !== this.targetEgg.id)
  },

  getReason(world) {
    return 'loss_reason_took_wrong_egg'
  }
}

const tooMuchHeroesCondition = {
  check(world) {
    return world.heroes.length > 50
  },

  getReason(world) {
    return 'loss_reason_too_mush_heroes'
  }
}

const level = {
  mapConfig: map,
  messages: messages,

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