import Item from './Item'
import ObjectType from './ObjectType'

const rngRegExp = /^rng\(([0-9]+),([0-9]+)\)$/

export default class Egg extends Item {
  constructor(config) {
    config = Object.assign({
      value: "rng(0,9)",
      showLottery: false,
    }, config)

    super(config)

    this.initValueGenerator()
  }

  initValueGenerator() {
    if (typeof this.value === 'string') {
      let matches
      if (matches = this.value.match(rngRegExp)) {
        this.generateValue = (rng) => {
          const min = parseInt(matches[1])
          const max = parseInt(matches[2])

          return Math.floor(rng() * (max - min + 1)) + min
        }
      } else {
        this.value = parseInt(this.value)
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
      let oldValue = this.value
      let newValue = value.getFirstIntegerValue().value
      this.value = newValue
      this.events.emit('write', this, oldValue, newValue)
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