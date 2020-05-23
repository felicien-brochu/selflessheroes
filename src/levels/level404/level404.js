import map from './map404.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level404-messages-${language}.json`)
}

const winCondition = {
  beforeStart(world) {
    let nEgg = world.eggs.find(egg => egg.y === 2)
    this.targetEgg = world.eggs.find(egg => egg.y === 3 && egg.x === nEgg.value + 2).shallowCopy()
  },

  check(world) {
    let cauldronContent = world.cauldrons[0].items
    return cauldronContent.length === 1 && cauldronContent[0].id === this.targetEgg.id
  }
}

const tookWrongEggCondition = {
  beforeStart(world) {
    let nEgg = world.eggs.find(egg => egg.y === 2)
    this.targetEgg = world.eggs.find(egg => egg.y === 3 && egg.x === nEgg.value + 2).shallowCopy()
  },

  check(world) {
    return world.heroes.some(hero => hero.item && hero.item.id !== this.targetEgg.id)
  },

  getReason(world) {
    return 'loss_reason_took_wrong_egg'
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 200,
  speedTarget: 32,
  lengthTarget: 10,

  compilerConfig: {
    excludePrimary: [],
    cloneIsDeadly: false,
    terrainTypes: ['floor', 'wall'],
    objectTypes: ['hero', 'egg', 'cauldron', 'nothing'],
    actionFunctions: ['take', 'drop'],
    valueFunctions: ['set', 'calc'],
    variables: 1,
    leftComparisonExpressions: ['direction', 'myitem', 'variable'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'myitem', 'integer', 'variable']
  },

  ruleset: {
    win: [winCondition],
    lose: [tookWrongEggCondition, 'or', 'one_hero_dead', 'or', 'default_loss']
  },
}

export default level