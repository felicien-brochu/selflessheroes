import Item from './Item'
import ObjectType from './ObjectType'

export default class Egg extends Item {
  constructor(config, tileWidth, tileHeight) {
    super(config, tileWidth, tileHeight)
    this.value = null
    this.parseProperties()
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