import ConfigObject from './ConfigObject'

export default class PathConfig extends ConfigObject {
  constructor(config, tileWidth, tileHeight) {
    super(config, tileWidth, tileHeight)
    this.path = config.polygon || config.polyline
    this.yoyo = false
    this.stepRythm = 1
    this.parseProperties()

    this.initPath(tileWidth, tileHeight)
  }

  initPath(tileWidth, tileHeight) {
    this.path = this.path.map(point => ({
      x: Math.floor((this.config.x + point.x) / tileWidth),
      y: Math.floor((this.config.y + point.y) / tileHeight)
    }))
  }
}