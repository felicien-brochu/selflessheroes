import DefaultLossReason from './DefaultLossReason'
import Condition from './Condition'

export default class AllHeroDeadCondition extends Condition {
  check(world) {
    return world.heroes.reduce((dead, hero) => dead && hero.dead, true)
  }

  getReason(world) {
    return DefaultLossReason.reasons.allHeroDead
  }
}