import map from './map011.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level011-messages-${language}.json`)
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 300,
  speedTarget: 57,
  lengthTarget: 9,
  deterministic: true,

  bossTellsSomething: true,
  bossName: "ogre",

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
    terrainTypes: ['hole', 'floor', 'wall'],
    objectTypes: ['switch', 'spikes', 'nothing'],
    actionFunctions: ['step_once'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: ['all_npc_dead'],
    lose: ['all_hero_dead', 'or', 'one_hero_dead', 'or', 'too_many_steps']
  }
}

export default level