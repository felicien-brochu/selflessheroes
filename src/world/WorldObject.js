import EventEmitter from 'events'

export default class WorldObject {
  constructor(config) {
    this.config = config
    Object.assign(this, config)
    this.events = new EventEmitter()
  }

  overlaps(object) {
    return this.x === object.x && this.y === object.y
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