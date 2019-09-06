import Item from './Item'
import ObjectType from './ObjectType'

const rngRegExp = /^rng\(([0-9]+),([0-9]+)\)$/

export default class Egg extends Item {
  constructor(config) {
    if (config.value === undefined) {
      config.value = "rng(0,9)"
    }
    if (config.showLottery === undefined) {
      config.showLottery = false
    }

    super(config)

    this.initValueGenerator()
  }

  initValueGenerator() {
    let matches
    if (typeof this.value === 'string' && (matches = this.value.match(rngRegExp)).length > 0) {
      this.generateValue = (rng) => {
        const min = parseInt(matches[1])
        const max = parseInt(matches[2])

        return Math.floor(rng() * (max - min + 1)) + min
      }
    }
  }

  hasValueGenerator() {
    return typeof this.generateValue === 'function'
  }

  initValue(rng) {
    if (this.hasValueGenerator()) {
      this.value = this.generateValue(rng)
    }
  }

  write(value) {
    if (value.hasIntegerValue()) {
      this.value = value.getFirstIntegerValue().value
    }
  }

  getObjectType() {
    return ObjectType.egg
  }

  shallowCopy() {
    let copy = super.shallowCopy()
    return Object.assign(copy, {
      value: this.value
    })
  }
}