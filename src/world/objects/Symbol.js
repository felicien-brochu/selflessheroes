import WorldObject from './WorldObject'
import ObjectType from './ObjectType'

export default class Symbol extends WorldObject {
  constructor(config) {
    if (config.symbol === undefined) {
      config.symbol = 'cross'
    }

    super(config)
  }

  getObjectType() {
    return ObjectType.symbol
  }
}