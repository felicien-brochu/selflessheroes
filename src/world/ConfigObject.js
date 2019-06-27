export default class ConfigObject {
  constructor(config, tileWidth, tileHeight) {
    this.config = config
    this.id = config.id
    this.type = config.type
    this.name = config.name
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
}