export default class Condition {
  constructor(world, config = {}) {
    this.world = world
    this.config = config
  }

  step() {}

  check() {
    return false
  }

  getReason() {
    return null
  }
}