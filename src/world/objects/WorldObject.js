import EventEmitter from 'events'

export default class WorldObject {
  constructor(config) {
    this.config = config
    this._removed = false

    Object.assign(this, config)

    this.events = new EventEmitter()
  }

  get removed() {
    return this._removed
  }

  set removed(removed) {
    let change = removed !== this._removed
    this._removed = removed
    if (change) {
      this.events.emit('removed', this)
    }
  }

  overlaps(object) {
    return this.x === object.x && this.y === object.y
  }

  distanceFrom(object) {
    return Math.sqrt((this.x - object.x) ** 2 + (this.y - object.y) ** 2)
  }

  getObjectType() {
    throw new Error('Needs subclass implementation')
  }

  shallowCopy() {
    return {
      id: this.id,
      type: this.getObjectType(),
      x: this.x,
      y: this.y
    }
  }
}