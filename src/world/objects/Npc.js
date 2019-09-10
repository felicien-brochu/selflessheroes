import Character from './Character'
import ObjectType from './ObjectType'

export default class Npc extends Character {
  constructor(config, world) {
    if (config.race === undefined) {
      config.race = ''
    }
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