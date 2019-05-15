import WorldObject from './WorldObject'
import ObjectType from './ObjectType'

export default class Switch extends WorldObject {
  constructor(config, tileWidth, tileHeight) {
    super(config, tileWidth, tileHeight)
    this.enabled = false
    this.autoDisable = true
    this.parseProperties()
  }

  enable() {
    this.enabled = true
  }

  disable(force = false) {
    if (this.autoDisable || force) {
      this.enabled = false
    }
  }

  isDisabled() {
    return !this.enabled
  }

  isEnabled() {
    return this.enabled
  }

  getObjectType() {
    return ObjectType.switch
  }
}