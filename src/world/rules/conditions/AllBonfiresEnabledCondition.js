import Condition from './Condition'

export default class AllBonfiresEnabledCondition extends Condition {
  check(world) {
    let disabled = false
    for (let bonfire of world.bonfires) {
      if (bonfire.isDisabled()) {
        disabled = true
        break
      }
    }

    return !disabled
  }
}