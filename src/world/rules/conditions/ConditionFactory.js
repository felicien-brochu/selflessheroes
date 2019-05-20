import DefaultLossCondition from './DefaultLossCondition'
import TooManyStepsCondition from './TooManyStepsCondition'
import AllHeroEndedCondition from './AllHeroEndedCondition'
import AllHeroDeadCondition from './AllHeroDeadCondition'
import OneHeroDeadCondition from './OneHeroDeadCondition'

import AllSwitchesEnabledCondition from './AllSwitchesEnabledCondition'
import AllBonfiresEnabledCondition from './AllBonfiresEnabledCondition'

const conditionMap = {
  default_loss: DefaultLossCondition,
  too_many_steps: TooManyStepsCondition,
  all_hero_ended: AllHeroEndedCondition,
  all_hero_dead: AllHeroDeadCondition,
  one_hero_dead: OneHeroDeadCondition,

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