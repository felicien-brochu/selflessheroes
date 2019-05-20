import Reason from './Reason'
import Condition from './Condition'

export default class AllBonfiresEnabledCondition extends Condition {
  check() {
    let disabled = false
    for (let bonfire of this.world.bonfires) {
      if (bonfire.isDisabled()) {
        disabled = true
        break
      }
    }

    return !disabled
  }

  getReason() {
    return Reason.allBonfiresEnabled
  }
}