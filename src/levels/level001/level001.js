import map from './map001.json'

import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level001-messages-${language}.json`)
}

const level = {
  mapConfig: map,
  messages: messages,

  startingCode: "step(s)\nstep(s)\n",
  maxStep: 100,
  speedTarget: 3,
  lengthTarget: 3,
  deterministic: true,
  tutorialConfig: 'basic_tutorial',

  compilerConfig: {
    excludePrimary: ['assign', 'if', 'else', 'endif', 'jump', 'anchor', 'clone'],
    actionFunctions: ['step'],
  },

  ruleset: {
    win: 'all_switches',
    lose: 'default_loss'
  }
}

export default level