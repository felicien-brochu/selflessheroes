import DefaultRuleset from './DefaultRuleset'

export default class Ruleset {

  constructor(world, maxStep = Infinity) {
    this.world = world
    this.maxStep = maxStep
  }

  step() {

  }

  hasWon() {
    return false
  }

  hasLost() {
    return this.tooManySteps()
  }

  tooManySteps() {
    return this.world.steps > this.maxStep
  }
}