import map from './map011.json'
import enMessages from './level011-messages-en.json'
import frMessages from './level011-messages-fr.json'

const level = {
  mapConfig: map,
  messages: {
    en: enMessages,
    fr: frMessages
  },

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