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
    let oneEndedNotDead = false
    let endedOrDead = true
    for (let hero of this.world.heroes) {
      oneEndedNotDead |= (hero.getDebugContext().ended && !hero.dead)
      endedOrDead &= (hero.getDebugContext().ended || hero.dead)
    }
    return endedOrDead && oneEndedNotDead
  }

  allHeroDead() {
    let dead = true
    for (let hero of this.world.heroes) {
      dead &= hero.dead
    }
    return dead
  }

  getLossReason() {
    let reason = null

    if (this.tooManySteps()) {
      reason = Ruleset.lossReasonTooManySteps
    } else if (this.allHeroEnded()) {
      reason = Ruleset.lossReasonAllHeroEnded
    } else if (this.allHeroDead()) {
      reason = Ruleset.lossReasonAllHeroDead
    }

    return reason
  }
}

Ruleset.lossReasonTooManySteps = 'loss_reason_too_many_steps'
Ruleset.lossReasonAllHeroEnded = 'loss_reason_all_hero_ended'
Ruleset.lossReasonAllHeroDead = 'loss_reason_all_hero_dead'