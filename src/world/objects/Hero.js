import Character from './Character'
import ObjectType from './ObjectType'

const nbColor = 11

export default class Hero extends Character {
  constructor(config, world) {
    super(config, world)

    this.color = this.getNextColor()
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

  clone(direction, config) {
    let cloneConfig = {
      ...this.config,
      id: this.world.getAvailableObjectID()
    }
    cloneConfig.item = null
    let clonedCharacter = new this.constructor(cloneConfig, this.world)
    clonedCharacter.ai = this.ai.cloneToAnchor(config.anchorStatement, clonedCharacter)
    clonedCharacter.x = this.x + direction.dx
    clonedCharacter.y = this.y + direction.dy

    return clonedCharacter
  }
}