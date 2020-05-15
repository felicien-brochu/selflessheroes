import Level from './Level'

export default class LocalLevel {

  constructor(config) {
    this.config = config

    this.hash = config.hash
    this.metadata = config.metadata
    this.levelCode = config.level

    if (IS_ELECTRON) {
      const {
        NodeVM
      } = require('../libs/vm2/main.js')
      const vm = new NodeVM({
        console: 'inherit',
        sandbox: {}
      })
      this.levelModule = vm.run(this.levelCode)
      this.level = new Level('local', this.levelModule, 'local')
    }
  }
}