import map from './map101.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level101-messages-${language}.json`)
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 50,
  speedTarget: 3,
  lengthTarget: 3,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['assign', 'if', 'else', 'endif', 'jump', 'anchor', 'clone'],
    actionFunctions: ['step', 'take', 'drop'],
  },

  ruleset: {
    win: [{
      type: 'eggs_in_cauldrons',
      config: {
        eggCauldronMap: [{
            eggs: [17],
            cauldron: 32
          },
          {
            eggs: [22],
            cauldron: 33
          },
          {
            eggs: [23],
            cauldron: 34
          },
          {
            eggs: [24],
            cauldron: 35
          },
        ]
      }
    }],
    lose: 'default_loss'
  }
}

export default level