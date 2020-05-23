import Ruleset from './Ruleset'
import ConditionGroup from './conditions/ConditionGroup'

export default class CustomRuleset extends Ruleset {
  constructor(world, config, trustedSource = false) {
    super(world)

    this.config = config
    this.trustedSource = trustedSource

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
    this.lossCondition = new ConditionGroup(config, this.trustedSource)
  }

  initWinCondition() {
    let config = this.config.win

    if (config) {
      if (!Array.isArray(config)) {
        config = [config]
      }
      this.winCondition = new ConditionGroup(config, this.trustedSource)
    }
  }

  beforeStart() {
    this.winCondition.beforeStart(this.world)
    this.lossCondition.beforeStart(this.world)
  }

  step() {
    this.winCondition.step(this.world)
    this.lossCondition.step(this.world)
  }

  hasWon() {
    return this.winCondition && this.winCondition.check(this.world)
  }

  hasLost() {
    return this.lossCondition && this.lossCondition.check(this.world)
  }

  getLossReason() {
    if (this.hasLost()) {
      return this.lossCondition.getReason(this.world)
    }
    return null
  }
}