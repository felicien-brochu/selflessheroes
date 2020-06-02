module.exports = {
  mapConfig: MAP_CONFIG,
  messages: {
    "en": {
      "name": "Vertigo",
      "objective": "Trigger all the %%icon icon-switch$%% switches\n\n%%icon mdi mdi-alert-octagon-outline$%%Warning: don't let your %%icon icon-hero$%% heroes fall into the hole."
    }
  },

  maxStep: 100,
  speedTarget: 4,
  lengthTarget: 7,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['assign', 'jump', 'clone'],
    terrainTypes: ['hole', 'floor'],
    objectTypes: ['switch', 'nothing'],
    actionFunctions: ['step'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: 'all_switches',
    lose: ['one_hero_dead', 'or', 'default_loss']
  }
}