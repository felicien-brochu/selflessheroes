import ConfigObject from './ConfigObject'

export default class PathConfig extends ConfigObject {
  constructor(config) {
    config = Object.assign({
      yoyo: false,
      stepRythm: 1,
    }, config)

    super('path', config)

    this.path = this.config.polygon || this.config.polyline
  }
}