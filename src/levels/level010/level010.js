import map from './map010.json'
const messages = {}
for (let language of SUPPORTED_LANGUAGES) {
  messages[language] = require(`./level010-messages-${language}.json`)
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 200,
  speedTarget: 69,
  lengthTarget: 8,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
    terrainTypes: ['hole', 'floor', 'wall'],
    objectTypes: ['bonfire', 'nothing'],
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