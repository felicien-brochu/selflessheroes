import map from './map005.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level005-messages-${language}.json`)
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 100,
  speedTarget: 4,
  lengthTarget: 7,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['assign', 'jump', 'clone'],
    terrainTypes: ['hole', 'floor'],
    objectTypes: ['switch', 'nothing'],
    actionFunctions: ['step'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: 'all_switches',
    lose: ['one_hero_dead', 'or', 'default_loss']
  }
}

export default level