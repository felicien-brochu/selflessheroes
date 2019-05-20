export default class Condition {
  constructor(world) {
    this.world = world
  }

  step() {}

  check() {
    return false
  }

  getReason() {
    return null
  }
}