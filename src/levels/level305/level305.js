import map from './map305.json'
import enMessages from './level305-messages-en.json'
import frMessages from './level305-messages-fr.json'

const winCondition = {
  beforeStart() {
    this.masterEgg = this.world.eggs.find(egg => egg.id === 316).shallowCopy()
    this.selectedEggs = this.world.eggs
      .filter(egg => egg.value % 2 === this.masterEgg.value % 2 && egg.id !== this.masterEgg.id)
      .map(egg => egg.id)
  },

  check() {
    return this.selectedEggs.every(eggID => this.world.cauldrons.some(cauldron => cauldron.items.some(item => item.id === eggID)))
  },
}

const wrongEggInCauldronLossCondition = {
  beforeStart() {
    this.masterEgg = this.world.eggs.find(egg => egg.id === 316).shallowCopy()
    this.selectedEggs = this.world.eggs
      .filter(egg => egg.value % 2 === this.masterEgg.value % 2 && egg.id !== this.masterEgg.id)
      .map(egg => egg.id)
  },

  check() {
    return this.world.cauldrons.some(cauldron => cauldron.items.some(item => this.selectedEggs.every(eggID => item.id !== eggID)))
  },

  getReason() {
    if (this.masterEgg.value % 2 === 0) {
      return 'loss_reason_wrong_egg_in_cauldron_even'
    } else {
      return 'loss_reason_wrong_egg_in_cauldron_odd'
    }
  }
}

const level = {
  mapConfig: map,
  messages: {
    en: enMessages,
    fr: frMessages
  },

  maxStep: 40,
  speedTarget: 5,
  lengthTarget: 10,

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['floor', 'wall'],
    objectTypes: ['cauldron'],
    actionFunctions: ['drop', 'tell', 'listen'],
    valueFunctions: ['set', 'calc'],
    variables: 1,
    messages: 8,
    leftComparisonExpressions: ['direction', 'myitem', 'variable'],
    rightComparisonExpressions: ['terrain_type', 'object_type', 'integer'],
  },

  ruleset: {
    win: [winCondition],
    lose: [wrongEggInCauldronLossCondition, 'or', 'default_loss']
  },
}

export default level