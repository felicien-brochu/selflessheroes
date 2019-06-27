import Character from './Character'
import ObjectType from './ObjectType'

export default class Npc extends Character {
  constructor(config, tileWidth, tileHeight, world) {
    super(config, tileWidth, tileHeight, world)

    this.race = ''
    this.parseProperties()
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