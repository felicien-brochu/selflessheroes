import Reason from './Reason'
import Condition from './Condition'

export default class AllHeroDeadCondition extends Condition {
  check() {
    let dead = true
    for (let hero of this.world.heroes) {
      dead &= hero.dead
    }
    return dead
  }

  getReason() {
    return Reason.allHeroDead
  }
}