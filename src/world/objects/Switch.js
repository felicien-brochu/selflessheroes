import WorldObject from './WorldObject'
import ObjectType from './ObjectType'

export default class Switch extends WorldObject {
  constructor(config) {
    config = Object.assign({
      enabled: false,
      autoDisable: true,
    }, config)

    super(config)
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

  shallowCopy() {
    let copy = super.shallowCopy()
    return Object.assign(copy, {
      enabled: this.enabled,
      autoDisable: this.autoDisable
    })
  }
}