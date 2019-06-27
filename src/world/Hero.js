import Character from './Character'
import ObjectType from './ObjectType'

const nbColor = 8

export default class Hero extends Character {
  constructor(config, tileWidth, tileHeight, world) {
    super(config, tileWidth, tileHeight, world)

    this.color = this.getNextColor()
    this.parseProperties()
  }

  getNextColor() {
    return this.world.characters.length % nbColor
  }

  getObjectType() {
    return ObjectType.hero
  }

  shallowCopy() {
    let copy = super.shallowCopy()
    return Object.assign(copy, {
      color: this.color
    })
  }
}