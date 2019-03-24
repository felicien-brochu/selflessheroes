import WorldObject from './WorldObject'

export default class Objective extends WorldObject {
  constructor(config, tileWidth, tileHeight) {
    super(config, tileWidth, tileHeight)
    this.enabled = false
    this.color = 0
    this.parseProperties()
  }

  enable() {
    this.enabled = true
  }

  isDisabled() {
    return !this.enabled
  }

  isEnabled() {
    return this.enabled
  }
}