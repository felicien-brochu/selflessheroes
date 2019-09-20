export default class Ruleset {

  constructor(world) {
    this.world = world
  }

  beforeStart() {

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