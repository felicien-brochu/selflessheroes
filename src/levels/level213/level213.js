import map from './map213.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level213-messages-${language}.json`)
}

const winCondition = {
  beforeStart(world) {},

  check(world) {
    return world.cauldrons[0].items.length === world.eggs.length
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 200,
  speedTarget: 63,
  lengthTarget: 5,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['if', 'clone'],
    terrainTypes: ['wall', 'floor', 'hole'],
    objectTypes: ['cauldron', 'egg', 'hero'],
    actionFunctions: ['take', 'drop'],
    valueFunctions: ['nearest'],
    variables: 2,
  },

  ruleset: {
    win: [winCondition],
    lose: 'default_loss'
  },
}

export default level