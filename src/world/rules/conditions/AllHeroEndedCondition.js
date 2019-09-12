import DefaultLossReason from './DefaultLossReason'
import Condition from './Condition'

export default class AllHeroEndedCondition extends Condition {
  check() {
    let ended = true
    for (let hero of this.world.heroes.filter(h => !h.dead)) {
      ended &= hero.getDebugContext().ended
    }
    return ended
  }

  getReason() {
    return DefaultLossReason.reasons.allHeroEnded
  }
}