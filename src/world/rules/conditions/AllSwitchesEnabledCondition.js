import Reason from './Reason'
import Condition from './Condition'

export default class AllSwitchesEnabledCondition extends Condition {
  check() {
    let disabled = false
    for (let mySwitch of this.world.switches) {
      if (mySwitch.isDisabled()) {
        disabled = true
        break
      }
    }

    return !disabled
  }

  getReason() {
    return Reason.allSwitchesEnabled
  }
}