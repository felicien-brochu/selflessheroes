export default class Condition {
  constructor(config = {}) {
    this.config = config
  }

  beforeStart(world) {}

  step(world) {}

  check(world) {
    return false
  }

  getReason(world) {
    return null
  }
}