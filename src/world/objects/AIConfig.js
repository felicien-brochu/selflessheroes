import ConfigObject from './ConfigObject'

export default class AIConfig extends ConfigObject {
  constructor(config) {
    if (config.type === undefined) {
      config.type = 'idle'
    }

    super(config)
  }
}