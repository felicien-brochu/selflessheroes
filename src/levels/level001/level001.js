import map from './map001.json'
import enMessages from './level001-messages-en.json'
import frMessages from './level001-messages-fr.json'

const level = {
  mapConfig: map,
  messages: {
    en: enMessages,
    fr: frMessages
  },

  startingCode: "step(s)\nstep(s)\n",
  maxStep: 100,
  speedTarget: 3,
  lengthTarget: 3,
  deterministic: true,
  tutorialConfig: 'basic_tutorial',

  compilerConfig: {
    excludePrimary: ['assign', 'if', 'else', 'endif', 'jump', 'anchor', 'clone'],
    actionFunctions: ['step_once'],
  },

  ruleset: {
    win: 'all_switches',
    lose: 'default_loss'
  }
}

export default level