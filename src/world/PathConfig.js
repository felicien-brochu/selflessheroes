import ConfigObject from './ConfigObject'

export default class PathConfig extends ConfigObject {
  constructor(config) {
    if (config.yoyo === undefined) {
      config.yoyo = false
    }
    if (config.stepRythm === undefined) {
      config.stepRythm = 1
    }

    super(config)

    this.path = this.config.polygon || this.config.polyline
  }
}