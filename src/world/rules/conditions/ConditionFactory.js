import DefaultLossCondition from './DefaultLossCondition'
import AllHeroDeadCondition from './AllHeroDeadCondition'
import AllHeroEndedCondition from './AllHeroEndedCondition'
import TooManyStepsCondition from './TooManyStepsCondition'

import AllSwitchesEnabledCondition from './AllSwitchesEnabledCondition'
import AllBonfiresEnabledCondition from './AllBonfiresEnabledCondition'

const conditionMap = {
  default_loss: DefaultLossCondition,
  all_hero_dead: AllHeroDeadCondition,
  all_hero_ended: AllHeroEndedCondition,
  too_many_steps: TooManyStepsCondition,

  all_switches: AllSwitchesEnabledCondition,
  all_bonfires: AllBonfiresEnabledCondition
}

export default class ConditionFactory {
  static build(key, world) {
    let conditionClass = conditionMap[key]
    let condition = null
    if (conditionClass) {
      condition = new conditionClass(world)
    }
    return condition
  }
}