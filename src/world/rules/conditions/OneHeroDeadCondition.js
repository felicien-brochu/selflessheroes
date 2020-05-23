import DefaultLossReason from './DefaultLossReason'
import Condition from './Condition'

export default class OneHeroDeadCondition extends Condition {
  check(world) {
    return world.heroes.some(hero => hero.dead)
  }

  getReason(world) {
    return DefaultLossReason.reasons.oneHeroDead
  }
}