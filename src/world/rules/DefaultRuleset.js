import Ruleset from './Ruleset'
import AllSwitchesWinCondition from './AllSwitchesWinCondition'

export default class DefaultRuleset extends Ruleset {
  constructor(world, maxStep) {
    super(world, maxStep)

    this.winCondition = new AllSwitchesWinCondition(this.world)
  }

  step() {

  }

  hasWon() {
    return this.winCondition.check()
  }
}