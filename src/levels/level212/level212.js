import map from './map212.json'
import enMessages from './level212-messages-en.json'
import frMessages from './level212-messages-fr.json'

const winCondition = {
  beforeStart() {},

  check() {
    return this.world.cauldrons[0].items.length === this.world.eggs.length
  }
}

const level = {
  mapConfig: map,
  messages: {
    en: enMessages,
    fr: frMessages
  },

  maxStep: 100,
  speedTarget: 34,
  lengthTarget: 2,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['if', 'else', 'endif', 'jump', 'anchor', 'clone'],
    terrainTypes: ['wall', 'floor', 'hole'],
    objectTypes: ['cauldron', 'egg', 'hero'],
    actionFunctions: ['drop'],
    valueFunctions: ['nearest'],
    variables: 1,
  },

  ruleset: {
    win: [winCondition],
    lose: 'default_loss'
  },
}

export default level