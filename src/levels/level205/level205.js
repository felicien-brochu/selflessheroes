import map from './map205.json'
const messages = {}
for (let language of SUPPORTED_LANGUAGES) {
  messages[language] = require(`./level205-messages-${language}.json`)
}

const winCondition = {
  beforeStart() {
    this.startEggs = this.world.eggs.map(egg => egg.shallowCopy())
  },

  check() {
    return this.startEggs.every(startEgg => {
      let actualEgg = this.world.eggs.find(egg => egg.id === startEgg.id)
      return actualEgg.value === startEgg.value + 1
    })
  }
}

const wrongValueOnEggLossCondition = {
  beforeStart() {
    this.startEggs = this.world.eggs.map(egg => egg.shallowCopy())
  },

  check() {
    return this.startEggs.some(startEgg => {
      let actualEgg = this.world.eggs.find(egg => egg.id === startEgg.id)
      return actualEgg.value !== startEgg.value && actualEgg.value !== startEgg.value + 1
    })
  },

  getReason() {
    return 'loss_reason_wrong_value_on_egg'
  }
}

const displacedNumberedEggLossCondition = {
  beforeStart() {
    let numberedEggsOriginMarker = this.world.findConfigObjectByID(120)
    this.numberedEggs = this.world.eggs.filter(egg => egg.y >= numberedEggsOriginMarker.y && egg.y < numberedEggsOriginMarker.y + 6)
  },

  check() {
    return this.numberedEggs.some(egg => !!egg.owner)
  },

  getReason() {
    return 'loss_reason_numbered_egg_displaced'
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 20,
  speedTarget: 2,
  lengthTarget: 2,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['if', 'else', 'endif', 'jump', 'anchor', 'clone'],
    actionFunctions: ['write'],
    valueFunctions: ['set', 'calc'],
    variables: 1,
  },

  ruleset: {
    win: [winCondition],
    lose: [wrongValueOnEggLossCondition, 'or', 'default_loss']
  },
}

export default level