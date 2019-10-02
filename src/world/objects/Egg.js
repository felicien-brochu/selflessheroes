import Item from './Item'
import ObjectType from './ObjectType'


export default class Egg extends Item {
  constructor(config) {
    config = Object.assign({
      value: "rng(0,9)",
      showLottery: false,
    }, config)

    super(config)

    this.initValueGenerator()
    this.initLottery()
  }

  initValueGenerator() {
    if (typeof this.value === 'string' && valueGeneratorRegExp.test(this.value)) {
      this.generateValue = createValueGenerator(this.value)
    } else {
      this.value = parseInt(this.value)
    }
  }

  initLottery() {
    if (this.showLottery) {
      if (this.lottery) {
        this.nextLotteryValue = createValueGenerator(this.lottery)
      } else {
        this.nextLotteryValue = this.generateValue
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

  throwInHole() {
    this.removed = true
    this.events.emit('fell-in-hole', this)
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

const valueGeneratorRegExp = /^rng\(([0-9]+),([0-9]+)\)$/

function createValueGenerator(generatorDef) {
  let matches
  if (matches = generatorDef.match(valueGeneratorRegExp)) {
    const min = parseInt(matches[1])
    const max = parseInt(matches[2])
    return rng => Math.floor(rng() * (max - min + 1)) + min
  }
  throw new Error(`Value generator definition "${generatorDef}" does not match the pattern "rng(min,max)"`)
}