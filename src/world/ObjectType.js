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

ObjectType.nothing = Symbol('nothingType')
ObjectType.hero = Symbol('heroType')
ObjectType.npc = Symbol('npcType')
ObjectType.switch = Symbol('switchType')
ObjectType.bonfire = Symbol('bonfireType')
ObjectType.spikes = Symbol('spikesType')
ObjectType.egg = Symbol('eggType')

ObjectType.symbol = Symbol('symbol')

Object.freeze(ObjectType)