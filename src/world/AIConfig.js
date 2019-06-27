import ConfigObject from './ConfigObject'

export default class AIConfig extends ConfigObject {
  constructor(config, tileWidth, tileHeight) {
    super(config, tileWidth, tileHeight)
    this.type = 'idle'
    this.parseProperties()
  }
}