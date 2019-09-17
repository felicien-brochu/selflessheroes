import Ruleset from './Ruleset'
import ConditionGroup from './conditions/ConditionGroup'

export default class CustomRuleset extends Ruleset {
  constructor(world, config) {
    super(world)

    this.config = config

    this.winCondition = null
    this.lossCondition = null
    this.initWinCondition()
    this.initLossCondition()
  }

  initLossCondition() {
    let config = this.config.lose

    if (!config) {
      config = 'default_loss'
    }
    if (!Array.isArray(config)) {
      config = [config]
    }
    this.lossCondition = new ConditionGroup(this.world, config)
  }

  initWinCondition() {
    let config = this.config.win

    if (config) {
      if (!Array.isArray(config)) {
        config = [config]
      }
      this.winCondition = new ConditionGroup(this.world, config)
    }
  }

  beforeStart() {
    this.winCondition.beforeStart()
    this.lossCondition.beforeStart()
  }

  step() {
    this.winCondition.step()
    this.lossCondition.step()
  }

  hasWon() {
    return this.winCondition && this.winCondition.check()
  }

  hasLost() {
    return this.lossCondition && this.lossCondition.check()
  }

  getLossReason() {
    if (this.hasLost()) {
      return this.lossCondition.getReason()
    }
    return null
  }
}