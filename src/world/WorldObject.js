export default class WorldObject {
  constructor(config, tileWidth, tileHeight) {
    this.config = config
    this.x = (config.x - (config.x % tileWidth)) / tileWidth
    this.y = (config.y - (config.y % tileHeight)) / tileHeight
  }

  parseProperties() {
    if (this.config.properties) {
      for (let property of this.config.properties) {
        this[property.name] = property.value
      }
    }
  }

  overlaps(object) {
    return this.x === object.x && this.y === object.y
  }

  getObjectType() {
    throw new Error('Needs subclass implementation')
  }

  getDebugContext() {
    throw new Error('Needs subclass implementation')
  }
}