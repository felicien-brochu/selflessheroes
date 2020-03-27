import map from './map007.json'
const messages = {}
for (let language of SUPPORTED_LANGUAGES) {
  messages[language] = require(`./level007-messages-${language}.json`)
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 100,
  speedTarget: 4,
  lengthTarget: 5,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['assign', 'jump', 'anchor', 'clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['bonfire', 'hero', 'nothing'],
    actionFunctions: ['step_once', 'fireball'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: 'all_bonfires',
    lose: ['one_hero_dead', 'or', 'default_loss']
  }
}

export default level