import map from './map204.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level204-messages-${language}.json`)
}

const winCondition = {
  beforeStart(world) {
    let numberedEggsOriginMarker = world.findConfigObjectByID(120)
    let writeEggsOriginMarker = world.findConfigObjectByID(99)
    this.numberedEggs = world.eggs.filter(egg => egg.y >= numberedEggsOriginMarker.y && egg.y < numberedEggsOriginMarker.y + 6)
    this.writeEggs = world.eggs.filter(egg => egg.y === writeEggsOriginMarker.y).sort((a, b) => a.x - b.x).map(egg => egg.shallowCopy())
    for (let i = 0; i < 10; i++) {
      let eggLine = this.numberedEggs.filter(egg => egg.x === numberedEggsOriginMarker.x + i)
      let max = eggLine.reduce((acc, egg) => Math.max(acc, egg.value), 0)
      this.writeEggs[i] = {
        egg: this.writeEggs[i],
        max: max,
      }
    }
  },

  check(world) {
    for (let target of this.writeEggs) {
      let actualEgg = world.findWorldObjectByID(target.egg.id)
      if (!!actualEgg.owner ||
        actualEgg.x !== target.egg.x ||
        actualEgg.y !== target.egg.y ||
        actualEgg.value !== target.max
      ) {
        return false
      }
    }
    return true
  }
}

const wrongValueOnEggLossCondition = {
  beforeStart(world) {
    let numberedEggsOriginMarker = world.findConfigObjectByID(120)
    let writeEggsOriginMarker = world.findConfigObjectByID(99)
    this.numberedEggs = world.eggs.filter(egg => egg.y >= numberedEggsOriginMarker.y && egg.y < numberedEggsOriginMarker.y + 6)
    this.writeEggs = world.eggs.filter(egg => egg.y === writeEggsOriginMarker.y).sort((a, b) => a.x - b.x)

    for (let i = 0; i < 10; i++) {
      let eggLine = this.numberedEggs.filter(egg => egg.x === numberedEggsOriginMarker.x + i)
      let max = eggLine.reduce((acc, egg) => Math.max(acc, egg.value), 0)
      this.writeEggs[i] = {
        egg: this.writeEggs[i],
        max: max,
      }
    }
  },

  check(world) {
    return this.writeEggs.some(target => target.egg.value !== target.max && target.egg.value !== 0)
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

  maxStep: 400,
  speedTarget: 33,
  lengthTarget: 8,

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['hero', 'egg', 'nothing'],
    actionFunctions: ['step_once', 'take', 'drop', 'write'],
    valueFunctions: ['set'],
    variables: 1,
    leftComparisonExpressions: ['direction', 'variable', 'myitem'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'variable', 'integer', 'myitem']
  },

  ruleset: {
    win: [winCondition],
    lose: [displacedNumberedEggLossCondition, 'or', wrongValueOnEggLossCondition, 'or', 'default_loss']
  },

  worldGenerator: [{
    type: 'eggs_matrix',
    config: {
      originMarkerID: 120,
      width: 10,
      height: 6,

      strategy: {
        type: 'simple',
        eggConfig: {
          value: 'rng(0,99)',
        }
      }
    }
  }, {
    type: 'eggs_matrix',
    config: {
      originMarkerID: 99,
      width: 10,
      height: 1,

      strategy: {
        type: 'simple',
        eggConfig: {
          value: 0,
        }
      }
    }
  }, ]
}

export default level