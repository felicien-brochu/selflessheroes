import DefaultLossReason from './DefaultLossReason'
import Condition from './Condition'

export default class AllHeroDeadCondition extends Condition {
  check(world) {
    return world.steps > world.level.maxStep
  }

  getReason(world) {
    return DefaultLossReason.reasons.tooManySteps
  }
}