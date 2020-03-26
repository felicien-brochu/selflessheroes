import map from './map004.json'
const messages = {}
for (let language of SUPPORTED_LANGUAGES) {
  messages[language] = require(`./level004-messages-${language}.json`)
}

const level = {
  mapConfig: map,
  messages: messages,

  startingCode: "if e == hero:\n\tstep(w)\nendif\n",
  maxStep: 100,
  speedTarget: 4,
  lengthTarget: 6,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['assign', 'jump', 'anchor', 'clone'],
    objectTypes: ['hero', 'switch', 'nothing'],
    actionFunctions: ['step_once'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type']
  },

  ruleset: {
    win: 'all_switches',
    lose: 'default_loss'
  }
}

export default level