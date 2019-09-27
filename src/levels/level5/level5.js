import map from './map5.json'

const level = {
  mapConfig: map,
  name: {
    en: "Vertigo",
    fr: "Vertige",
  },
  objective: {
    en: "Trigger all the %%icon icon-switch$%% switches\n\n%%icon mdi mdi-alert-octagon-outline$%%Warning: don't let your %%icon icon-hero$%% heroes fall into the hole.",
    fr: "Active tous les %%icon icon-switch$%% boutons\n\n%%icon mdi mdi-alert-octagon-outline$%%Attention: ne fais pas tomber les %%icon icon-hero$%% héros dans le trou.",
  },

  maxStep: 100,
  speedTarget: 4,
  lengthTarget: 7,

  compilerConfig: {
    excludePrimary: ['assign', 'jump', 'anchor'],
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