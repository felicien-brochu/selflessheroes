import WorldObject from './WorldObject'
import ObjectType from './ObjectType'

export default class Bonfire extends WorldObject {
  constructor(config) {
    config = Object.assign({
      enabled: false,
    }, config)

    super(config)
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

  getObjectType() {
    return ObjectType.bonfire
  }

  shallowCopy() {
    let copy = super.shallowCopy()
    return Object.assign(copy, {
      enabled: this.enabled
    })
  }
}