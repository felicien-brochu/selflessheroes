export default class AllObjectivesWinCondition {
  constructor(world) {
    this.world = world
  }

  check() {
    let disabled = false
    for (let objective of this.world.objectives) {
      if (objective.isDisabled()) {
        disabled = true
        break
      }
    }

    return !disabled
  }
}