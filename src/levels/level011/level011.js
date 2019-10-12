import map from './map011.json'

const level = {
  mapConfig: map,
  name: {
    en: "Be brave, run away!",
    fr: "Courage, fuyons\u00A0!",
  },
  objective: {
    en: "These two ogres are after you. Get rid of them before they catch up with you.\n\n%%icon mdi mdi-information-outline$%% Use the %%icon icon-switch$%% switches to disable/enable the %%icon icon-spikes$%% spikes.",
    fr: "Ces deux ogres en ont après toi. Débarrasses-en-toi avant qu'ils ne te rattrapent.\n\n%%icon mdi mdi-information-outline$%% Utilise les %%icon icon-switch$%% boutons pour activer/désactiver les %%icon icon-spikes$%% piques.",
  },
  messages: {
    boss_tell: {
      en: "Run! Run! Run, little thing!\nLet's see who's the fastest!",
      fr: "Cours ! Cours, petite chose !\nOn verra bien qui sera le plus rapide de nous deux !",
    },
  },

  maxStep: 300,
  speedTarget: 57,
  lengthTarget: 9,

  bossTellsSomething: true,
  bossName: "ogre",

  compilerConfig: {
    excludePrimary: ['assign'],
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