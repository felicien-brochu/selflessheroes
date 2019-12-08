import map from './map301.json'

const level = {
  mapConfig: map,
  name: {
    en: "Relay race",
    fr: "Course de relais",
  },
  objective: {
    en: "Trigger all the %%icon icon-switch$%% switches.\n\n%%icon mdi mdi-information-outline$%% Now heroes can talk to each other. Check the help about %%statement speach-statement$tell%% and %%statement speach-statement$listen%% to better understand how it works.",
    fr: "Active tous les %%icon icon-switch$%% boutons.\n\n%%icon mdi mdi-information-outline$%% Maintenant les héros peuvent se parler. Consulte l'aide à propos de %%statement speach-statement$dire%% et %%statement speach-statement$écouter%% pour mieux comprendre comment ça marche.",
  },

  maxStep: 200,
  speedTarget: 39,
  lengthTarget: 6,

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['floor', 'wall', 'hole'],
    objectTypes: ['switch', 'spikes'],
    actionFunctions: ['step_once', 'tell', 'listen'],
    valueFunctions: [],
    variables: 0,
    messages: 8,
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['terrain_type', 'object_type'],
    forbiddenExpressions: ['everyone']
  },

  ruleset: {
    win: ['all_switches'],
    lose: ['one_hero_dead', 'or', 'default_loss']
  },
}

export default level