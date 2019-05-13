export default class AllSwitchesWinCondition {
  constructor(world) {
    this.world = world
  }

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
}