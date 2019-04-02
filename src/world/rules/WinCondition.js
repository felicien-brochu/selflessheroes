export default class WinCondition {
  static build(key, world) {
    let condition
    switch (key) {
      case 'all_objectives':
        condition = new AllObjectivesWinCondition(world)
        break
      case 'none':
        condition = new WinCondition()
        break
      default:
        condition = new WinCondition()
    }
    return condition
  }

  check() {
    return false
  }
}

class AllObjectivesWinCondition extends WinCondition {

  constructor(world) {
    super()
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