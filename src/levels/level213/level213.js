import map from './map213.json'
const messages = {}
for (let language of SUPPORTED_LANGUAGES) {
  messages[language] = require(`./level213-messages-${language}.json`)
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

  maxStep: 200,
  speedTarget: 63,
  lengthTarget: 5,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['if', 'else', 'endif', 'clone'],
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