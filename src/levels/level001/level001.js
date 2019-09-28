import map from './map001.json'

/* speed: 3, length: 3
step(s)
step(s)
step(s)
*/

const level = {
  mapConfig: map,
  name: {
    en: "First steps",
    fr: "Premiers pas",
  },
  objective: {
    en: "Help the %%icon icon-hero$%% heroes to walk on the %%icon icon-switch$%% switches",
    fr: "Aide les %%icon icon-hero$%% héros à aller sur les %%icon icon-switch$%% boutons",
  },

  startingCode: "step(s)\nstep(s)\n",
  maxStep: 100,
  speedTarget: 3,
  lengthTarget: 3,
  tutorialConfig: 'basic_tutorial',

  compilerConfig: {
    excludePrimary: ['assign', 'if', 'else', 'endif', 'jump', 'anchor'],
    actionFunctions: ['step_once'],
  },

  ruleset: {
    win: 'all_switches',
    lose: 'default_loss'
  }
}

export default level