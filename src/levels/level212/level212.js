import map from './map212.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level212-messages-${language}.json`)
}

const winCondition = {
  beforeStart() {},

  check() {
    return this.world.cauldrons[0].items.length === this.world.eggs.length
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 100,
  speedTarget: 34,
  lengthTarget: 2,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['if', 'else', 'endif', 'jump', 'anchor', 'clone'],
    terrainTypes: ['wall', 'floor', 'hole'],
    objectTypes: ['cauldron', 'egg', 'hero'],
    actionFunctions: ['drop'],
    valueFunctions: ['nearest'],
    variables: 1,
  },

  ruleset: {
    win: [winCondition],
    lose: 'default_loss'
  },
}

export default level