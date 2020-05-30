import map from './map006.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level006-messages-${language}.json`)
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 100,
  speedTarget: 2,
  lengthTarget: 2,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['assign', 'jump', 'anchor', 'clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['bonfire', 'nothing'],
    actionFunctions: ['step', 'fireball'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: 'all_bonfires',
    lose: 'default_loss'
  }
}

export default level