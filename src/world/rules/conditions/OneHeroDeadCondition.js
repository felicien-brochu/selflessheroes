import Reason from './Reason'
import Condition from './Condition'

export default class OneHeroDeadCondition extends Condition {
  check() {
    return this.world.heroes.some(hero => hero.dead)
  }

  getReason() {
    return Reason.oneHeroDead
  }
}