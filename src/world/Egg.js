import WorldObject from './WorldObject'
import ObjectType from './ObjectType'

export default class Egg extends WorldObject {
  constructor(config, tileWidth, tileHeight) {
    super(config, tileWidth, tileHeight)
    this.value = null
    this.parseProperties()
  }

  getObjectType() {
    return ObjectType.egg
  }
}