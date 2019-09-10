import WorldObject from './WorldObject'
import ObjectType from './ObjectType'

export default class Cauldron extends WorldObject {
  constructor(config) {
    if (config.enabled === undefined) {
      config.enabled = true
    }

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
    return ObjectType.cauldron
  }

  shallowCopy() {
    let copy = super.shallowCopy()
    return Object.assign(copy, {
      enabled: this.enabled
    })
  }
}