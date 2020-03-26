import map from './map005.json'
const messages = {}
for (let language of SUPPORTED_LANGUAGES) {
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
    excludePrimary: ['assign', 'jump', 'anchor', 'clone'],
    terrainTypes: ['hole', 'floor'],
    objectTypes: ['switch', 'nothing'],
    actionFunctions: ['step_once'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: 'all_switches',
    lose: ['one_hero_dead', 'or', 'default_loss']
  }
}

export default level