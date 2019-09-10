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

ObjectType.nothing = 'nothing'
ObjectType.hero = 'hero'
ObjectType.npc = 'npc'
ObjectType.switch = 'switch'
ObjectType.bonfire = 'bonfire'
ObjectType.cauldron = 'cauldron'
ObjectType.spikes = 'spikes'
ObjectType.egg = 'egg'

ObjectType.symbol = 'symbol'

Object.freeze(ObjectType)