import Item from './Item'
import ObjectType from './ObjectType'

const rngRegExp = /^rng\(([0-9]+),([0-9]+)\)$/

export default class Egg extends Item {
  constructor(config, tileWidth, tileHeight) {
    super(config, tileWidth, tileHeight)
    this.value = null
    this.parseProperties()
  }

  initValue(rng) {
    let matches
    if (typeof this.value === 'string' && (matches = this.value.match(rngRegExp)).length > 0) {
      let min = parseInt(matches[1])
      let max = parseInt(matches[2])
      this.value = Math.floor(rng() * (max - min + 1)) + min
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