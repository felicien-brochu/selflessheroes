import Ruleset from './Ruleset'
import AllObjectivesWinCondition from './AllObjectivesWinCondition'

export default class DefaultRuleset extends Ruleset {
  constructor(world, maxStep) {
    super(world, maxStep)

    this.winCondition = new AllObjectivesWinCondition(this.world)
  }

  step() {

  }

  hasWon() {
    return this.winCondition.check()
  }
}