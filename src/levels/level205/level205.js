import map from './map205.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level205-messages-${language}.json`)
}

const winCondition = {
  beforeStart(world) {
    this.startEggs = world.eggs.map(egg => egg.shallowCopy())
  },

  check(world) {
    return this.startEggs.every(startEgg => {
      let actualEgg = world.eggs.find(egg => egg.id === startEgg.id)
      return actualEgg.value === startEgg.value + 1
    })
  }
}

const wrongValueOnEggLossCondition = {
  beforeStart(world) {
    this.startEggs = world.eggs.map(egg => egg.shallowCopy())
  },

  check(world) {
    return this.startEggs.some(startEgg => {
      let actualEgg = world.eggs.find(egg => egg.id === startEgg.id)
      return actualEgg.value !== startEgg.value && actualEgg.value !== startEgg.value + 1
    })
  },

  getReason(world) {
    return 'loss_reason_wrong_value_on_egg'
  }
}

const displacedNumberedEggLossCondition = {
  beforeStart(world) {
    let numberedEggsOriginMarker = world.findConfigObjectByID(120)
    this.numberedEggs = world.eggs.filter(egg => egg.y >= numberedEggsOriginMarker.y && egg.y < numberedEggsOriginMarker.y + 6)
  },

  check(world) {
    return this.numberedEggs.some(egg => !!egg.owner)
  },

  getReason(world) {
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