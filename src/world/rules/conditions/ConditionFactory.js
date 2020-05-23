import Condition from './Condition'

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
  static build(config, trustedSource = false) {
    if (typeof config === 'string') {
      return ConditionFactory.buildTemplate(config)
    } else if (typeof config === 'object') {
      if (typeof config.check === 'function') {
        return ConditionFactory.buildCustom(config, trustedSource)
      } else if (config.type !== undefined) {
        let conditionConfig = config.config || {}
        return ConditionFactory.buildTemplate(config.type, conditionConfig)
      }
    }
  }

  static buildCustom(config, trustedSource = false) {
    return new CustomCondition(config, trustedSource)
  }

  static buildTemplate(type, config = {}) {
    let conditionClass = conditionMap[type]
    let condition = null
    if (conditionClass) {
      condition = new conditionClass(config)
    }
    return condition
  }
}

class CustomCondition extends Condition {
  constructor(config, trustedSource = false) {
    super()
    this.config = config
    this.trustedSource = trustedSource
  }

  beforeStart(world) {
    if (typeof this.config.beforeStart === 'function') {
      this.config.beforeStart(this.trustedSource ? world : world.getProxy())
    }
  }

  step(world) {
    if (typeof this.config.step === 'function') {
      this.config.step(this.trustedSource ? world : world.getProxy())
    }
  }

  check(world) {
    if (typeof this.config.check === 'function') {
      return this.config.check(this.trustedSource ? world : world.getProxy())
    }
    return false
  }

  getReason(world) {
    if (typeof this.config.getReason === 'function') {
      return this.config.getReason(this.trustedSource ? world : world.getProxy())
    }
    return 'reason_custom'
  }
}