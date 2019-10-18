import ConfigObject from './ConfigObject'

export default class AIConfig extends ConfigObject {
  constructor(config) {
    config = Object.assign({
      type: "idle",
    }, config)

    super('ai', config)
  }
}