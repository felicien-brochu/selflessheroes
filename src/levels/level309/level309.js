import map from './map309.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level309-messages-${language}.json`)
}

const winCondition = {
  check(world) {
    return world.heroes.every(hero => hero.x >= 11)
  },
}


const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 600,
  speedTarget: 102,
  lengthTarget: 27,

  bossTellsSomething: true,
  bossName: "gatekeeper",

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['floor', 'wall'],
    objectTypes: ['hero', 'npc', 'switch', 'spikes', 'nothing'],
    actionFunctions: ['step', 'tell', 'listen'],
    valueFunctions: ['set', 'calc'],
    variables: 1,
    messages: 8,
    leftComparisonExpressions: ['direction', 'variable'],
    rightComparisonExpressions: ['terrain_type', 'object_type', 'integer'],
    forbiddenExpressions: ['myitem'],
  },

  ruleset: {
    win: [winCondition],
    lose: ['one_hero_dead', 'or', 'default_loss']
  },
}

export default level