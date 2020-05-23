import Condition from './Condition'

export default class AllSwitchesEnabledCondition extends Condition {
  check(world) {
    let disabled = false
    for (let mySwitch of world.switches) {
      if (mySwitch.isDisabled()) {
        disabled = true
        break
      }
    }

    return !disabled
  }
}