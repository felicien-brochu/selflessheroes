import Reason from './Reason'
import Condition from './Condition'

export default class AllHeroDeadCondition extends Condition {
  check() {
    return this.world.heroes.reduce((dead, hero) => dead && hero.dead, true)
  }

  getReason() {
    return Reason.allHeroDead
  }
}