import map from './map003.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level003-messages-${language}.json`)
}

const level = {
  mapConfig: map,
  messages: messages,

  startingCode: "if e == switch:\n\tstep(e)\nendif\n",
  maxStep: 100,
  speedTarget: 2,
  lengthTarget: 3,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['assign', 'jump', 'anchor', 'clone'],
    terrainTypes: ['hole', 'floor'],
    objectTypes: ['switch', 'nothing'],
    actionFunctions: ['step'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: 'all_switches',
    lose: 'default_loss'
  }
}

export default level