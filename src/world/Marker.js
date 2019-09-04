import ConfigObject from './ConfigObject'

export default class Marker extends ConfigObject {
  constructor(config, tileWidth, tileHeight) {
    super(config, tileWidth, tileHeight)
    this.parseProperties()
  }
}