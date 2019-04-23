import WinCondition from './WinCondition'
import LossCondition from './LossCondition'

import {
  namedPropertiesToObject
} from '../utils'

export default class RuleSet {
  static build(configJSON, world) {
    let config = namedPropertiesToObject(configJSON.properties)

    return new RuleSet(config, world)
  }

  constructor(config, world) {
    this.winCondition = WinCondition.build(config.winCondition, world)
    this.lossCondition = LossCondition.build(config.lossCondition, world)
  }

  checkWinCondition() {
    return this.winCondition.check()
  }

  checkLossCondition() {
    return this.lossCondition.check()
  }
}