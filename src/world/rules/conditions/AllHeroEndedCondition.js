import DefaultLossReason from './DefaultLossReason'
import Condition from './Condition'

export default class AllHeroEndedCondition extends Condition {
  check(world) {
    let ended = true
    for (let hero of world.heroes.filter(h => !h.dead)) {
      ended &= hero.getDebugContext().ended
    }
    return ended
  }

  getReason(world) {
    return DefaultLossReason.reasons.allHeroEnded
  }
}