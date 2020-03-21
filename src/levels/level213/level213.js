import map from './map213.json'
import enMessages from './level213-messages-en.json'
import frMessages from './level213-messages-fr.json'

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

  maxStep: 200,
  speedTarget: 63,
  lengthTarget: 5,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['if', 'else', 'endif', 'clone'],
    terrainTypes: ['wall', 'floor', 'hole'],
    objectTypes: ['cauldron', 'egg', 'hero'],
    actionFunctions: ['take', 'drop'],
    valueFunctions: ['nearest'],
    variables: 2,
  },

  ruleset: {
    win: [winCondition],
    lose: 'default_loss'
  },
}

export default level