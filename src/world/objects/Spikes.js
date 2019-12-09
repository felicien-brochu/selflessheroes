import WorldObject from './WorldObject'
import ObjectType from './ObjectType'

export default class Spikes extends WorldObject {
  constructor(config) {
    config = Object.assign({
      enabled: false,
      triggers: [],
      triggersNot: [],
    }, config)

    super(config)

    this.initialyEnabled = this.enabled
  }

  initTriggers(world) {
    this.linkTriggers('triggers', world)
    this.linkTriggers('triggersNot', world)
  }

  linkTriggers(triggersKey, world) {
    if (typeof this[triggersKey] === 'string') {
      let triggerIDs = this[triggersKey].split(',').filter(id => id.length > 0).map(id => parseInt(id))
      this[triggersKey] = []

      for (let id of triggerIDs) {
        this[triggersKey].push(world.findWorldObjectByID(id))
      }
    }
  }

  checkTriggers() {
    let triggersTriggered = (this.triggers.length > 0 || this.triggersNot.length > 0) && this.triggers.every(trigger => trigger.isEnabled())
    let triggersNotTriggered = this.triggersNot.length > 0 && this.triggersNot.some(trigger => trigger.isEnabled())

    if ((!this.initialyEnabled && triggersTriggered && !triggersNotTriggered) ||
      (this.initialyEnabled && (!triggersTriggered || triggersNotTriggered))) {
      this.enable()
    } else {
      this.disable()
    }
  }

  enable() {
    this.enabled = true
  }

  disable() {
    this.enabled = false
  }

  isDisabled() {
    return !this.enabled
  }

  isEnabled() {
    return this.enabled
  }

  getObjectType() {
    return ObjectType.spikes
  }

  shallowCopy() {
    let copy = super.shallowCopy()
    return Object.assign(copy, {
      enabled: this.enabled,
      triggers: this.triggers.map(trigger => trigger.id)
    })
  }
}