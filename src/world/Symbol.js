import WorldObject from './WorldObject'
import ObjectType from './ObjectType'

export default class Symbol extends WorldObject {
  constructor(config, tileWidth, tileHeight) {
    super(config, tileWidth, tileHeight)
    this.parseProperties()
  }

  getObjectType() {
    return ObjectType.symbol
  }
}