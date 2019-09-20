import WorldObject from './WorldObject'
import ObjectType from './ObjectType'

export default class Symbol extends WorldObject {
  constructor(config) {
    config = Object.assign({
      symbol: 'cross',
    }, config)

    super(config)
  }

  getObjectType() {
    return ObjectType.symbol
  }
}