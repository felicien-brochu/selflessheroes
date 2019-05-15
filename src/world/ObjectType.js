export default class ObjectType {
  static keyOf(type) {
    let key = null
    for (let propKey of Object.keys(ObjectType)) {
      if (ObjectType[propKey] === type) {
        key = propKey
        break
      }
    }

    return key
  }
}

ObjectType.hero = Symbol('heroType')
ObjectType.switch = Symbol('switchType')
ObjectType.bonfire = Symbol('bonfireType')

Object.freeze(ObjectType)