import map from './map103.json'
const messages = {}
for (let language of SUPPORTED_LANGUAGES) {
  messages[language] = require(`./level103-messages-${language}.json`)
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 100,
  speedTarget: 22,
  lengthTarget: 5,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg', 'nothing'],
    actionFunctions: ['take', 'drop'],
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['terrain_type', 'object_type']
  },

  ruleset: {
    win: [{
      type: 'eggs_in_cauldrons',
      config: {
        eggCauldronMap: [{
          eggs: [26],
          cauldron: 30
        }]
      }
    }],
    lose: 'default_loss'
  }
}

export default level