import map from './map304.json'

const level = {
  mapConfig: map,
  name: {
    en: "Starting blocks",
    fr: "Starting blocks",
  },
  objective: {
    en: "Trigger all the %%icon icon-switch$%% switches.\n\n%%icon mdi mdi-information-outline$%% Now heroes can talk to all heroes at once with %%statement speach-statement$tell%%.",
    fr: "Active tous les %%icon icon-switch$%% boutons.\n\n%%icon mdi mdi-information-outline$%% Maintenant les héros peuvent parler à tous les héros d'un coup avec %%statement speach-statement$dire%%.",
  },

  maxStep: 100,
  speedTarget: 31,
  lengthTarget: 7,

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
  },

  ruleset: {
    win: ['all_switches'],
    lose: ['one_hero_dead', 'or', 'default_loss']
  },
}

export default level