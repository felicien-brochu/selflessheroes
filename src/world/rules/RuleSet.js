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
    return !!this.getLossReason()
  }

  tooManySteps() {
    return this.world.steps > this.maxStep
  }

  allHeroEnded() {
    let ended = true
    for (let hero of this.world.heroes) {
      ended &= hero.getDebugContext().ended
    }
    return ended
  }

  static get lossReasonTooManySteps() {
    return 'loss_reason_too_many_steps'
  }

  static get lossReasonAllHeroEnded() {
    return 'loss_reason_all_hero_ended'
  }

  getLossReason() {
    let reason = null

    if (this.tooManySteps()) {
      reason = Ruleset.lossReasonTooManySteps
    } else if (this.allHeroEnded()) {
      reason = Ruleset.lossReasonAllHeroEnded
    }

    return reason
  }
}