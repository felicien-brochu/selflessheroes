import DefaultLossReason from './DefaultLossReason'
import Condition from './Condition'

export default class AllHeroDeadCondition extends Condition {
  check() {
    return this.world.steps > this.world.level.maxStep
  }

  getReason() {
    return DefaultLossReason.reasons.tooManySteps
  }
}