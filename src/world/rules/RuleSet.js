export default class Ruleset {

  constructor(world) {
    this.world = world
  }

  step() {

  }

  hasWon() {
    return false
  }

  hasLost() {
    return false
  }

  getLossReason() {
    return null
  }
}