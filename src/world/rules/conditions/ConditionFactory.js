import DefaultLossCondition from './DefaultLossCondition'
import TooManyStepsCondition from './TooManyStepsCondition'
import AllHeroEndedCondition from './AllHeroEndedCondition'
import AllHeroDeadCondition from './AllHeroDeadCondition'
import OneHeroDeadCondition from './OneHeroDeadCondition'

import AllSwitchesEnabledCondition from './AllSwitchesEnabledCondition'
import AllBonfiresEnabledCondition from './AllBonfiresEnabledCondition'
import AllNpcDeadCondition from './AllNpcDeadCondition'
import EggOnMarkerCondition from './EggOnMarkerCondition'
import EggsInCauldronsCondition from './EggsInCauldronsCondition'

const conditionMap = {
  default_loss: DefaultLossCondition,
  too_many_steps: TooManyStepsCondition,
  all_hero_ended: AllHeroEndedCondition,
  all_hero_dead: AllHeroDeadCondition,
  one_hero_dead: OneHeroDeadCondition,

  all_switches: AllSwitchesEnabledCondition,
  all_bonfires: AllBonfiresEnabledCondition,
  all_npc_dead: AllNpcDeadCondition,
  egg_on_marker: EggOnMarkerCondition,
  eggs_in_cauldrons: EggsInCauldronsCondition,
}

export default class ConditionFactory {
  static build(type, world, config = {}) {
    let conditionClass = conditionMap[type]
    let condition = null
    if (conditionClass) {
      condition = new conditionClass(world, config)
    }
    return condition
  }
}