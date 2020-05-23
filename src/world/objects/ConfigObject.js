export default class ConfigObject {
  constructor(type, config) {
    this.config = config
    this.type = type
    Object.assign(this, config)
  }

  shallowCopy() {
    return JSON.parse(JSON.stringify(this))
  }
}