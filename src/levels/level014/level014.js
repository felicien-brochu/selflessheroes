import map from './map014.json'

const level = {
  mapConfig: map,
  name: {
    en: "Beat around the bush",
    fr: "Tourne autour du pot",
  },
  objective: {
    en: "Trigger all the %%icon icon-switch-red$%% switches\n\n%%icon mdi mdi-information-outline$%% Once you triggered a red %%icon icon-switch-red$%% switch, it stays triggered. Even if you don't stay on it.",
    fr: "Active tous les %%icon icon-switch-red$%% boutons\n\n%%icon mdi mdi-information-outline$%% Dès qu'un %%icon icon-switch-red$%% bouton rouge est activé, il le reste. Même si le héro ne reste pas dessus.",
  },

  maxStep: 2000,
  speedTarget: 203,
  lengthTarget: 13,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['switch', 'nothing'],
    actionFunctions: ['step_once'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: 'all_switches',
    lose: 'default_loss'
  }
}

export default level