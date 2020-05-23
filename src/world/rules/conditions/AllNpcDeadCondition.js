import Condition from './Condition'

export default class AllNpcDeadCondition extends Condition {
  check(world) {
    let allDead = true
    for (let npc of world.npcs) {
      if (!npc.dead) {
        allDead = false
        break
      }
    }

    return allDead
  }
}