import map from './map109.json'
import enMessages from './level109-messages-en.json'
import frMessages from './level109-messages-fr.json'

const winCondition = {
  beforeStart() {
    this.eggsByValue = this.world.eggs.slice().sort((a, b) => a.value - b.value)
  },

  check() {
    let eggsByX = this.world.eggs.slice().sort((a, b) => a.owner.x - b.owner.x)
    return eggsByX.every((egg, i) => egg.value === this.eggsByValue[i].value)
  },
}

const level = {
  mapConfig: map,
  messages: {
    en: enMessages,
    fr: frMessages
  },

  maxStep: 400,
  speedTarget: 27,
  lengthTarget: 4,

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['hero', 'egg', 'nothing'],
    actionFunctions: ['step_once'],
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'direction', 'myitem']
  },

  ruleset: {
    win: [winCondition],
    lose: ['default_loss']
  }
}

export default level