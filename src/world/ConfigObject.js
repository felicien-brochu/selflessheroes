export default class ConfigObject {
  constructor(config) {
    this.config = config
    Object.assign(this, config)
  }
}