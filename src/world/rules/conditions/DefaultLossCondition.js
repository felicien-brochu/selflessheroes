import AllSwitchesEnabledCondition from './AllSwitchesEnabledCondition'
import AllHeroDeadCondition from './AllHeroDeadCondition'
import AllHeroEndedCondition from './AllHeroEndedCondition'
import TooManyStepsCondition from './TooManyStepsCondition'
import Condition from './Condition'

export default class DefaultLossCondition extends Condition {
  constructor() {
    super()

    this.conditions = [
      new AllHeroDeadCondition(),
      new AllHeroEndedCondition(),
      new TooManyStepsCondition()
    ]
  }

  step(world) {
    this.conditions.forEach(condition => condition.step(world))
  }

  check(world) {
    for (let condition of this.conditions) {
      if (condition.check(world)) {
        return true
      }
    }
    return false
  }

  getReason(world) {
    for (let condition of this.conditions) {
      if (condition.check(world)) {
        return condition.getReason(world)
      }
    }
    return null
  }
}