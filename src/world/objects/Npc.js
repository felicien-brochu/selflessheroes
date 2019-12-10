import Character from './Character'
import ObjectType from './ObjectType'

export default class Npc extends Character {
  constructor(config, world) {
    config = Object.assign({
      race: '',
      yOffset: 0,
    }, config)

    super(config, world)
  }

  getObjectType() {
    return ObjectType.npc
  }

  shallowCopy() {
    let copy = super.shallowCopy()
    return Object.assign(copy, {
      race: this.race
    })
  }
}