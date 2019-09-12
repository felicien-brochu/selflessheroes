import AllSwitchesEnabledCondition from './AllSwitchesEnabledCondition'
import AllHeroDeadCondition from './AllHeroDeadCondition'
import AllHeroEndedCondition from './AllHeroEndedCondition'
import TooManyStepsCondition from './TooManyStepsCondition'
import Condition from './Condition'

export default class DefaultLossCondition extends Condition {
  constructor(world) {
    super(world)

    this.conditions = [
      new AllHeroDeadCondition(world),
      new AllHeroEndedCondition(world),
      new TooManyStepsCondition(world)
    ]
  }

  step() {
    this.conditions.forEach(condition => condition.step())
  }

  check() {
    for (let condition of this.conditions) {
      if (condition.check()) {
        return true
      }
    }
    return false
  }

  getReason() {
    for (let condition of this.conditions) {
      if (condition.check()) {
        return condition.getReason()
      }
    }
    return null
  }
}