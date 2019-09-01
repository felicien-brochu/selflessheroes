import Reason from './Reason'
import Condition from './Condition'

export default class AllNpcDeadCondition extends Condition {
  check() {
    let allDead = true
    for (let npc of this.world.npcs) {
      if (!npc.dead) {
        allDead = false
        break
      }
    }

    return allDead
  }

  getReason() {
    return Reason.allNpcDead
  }
}