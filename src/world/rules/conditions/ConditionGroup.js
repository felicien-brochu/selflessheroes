import Reason from './Reason'
import Condition from './Condition'
import ConditionFactory from './ConditionFactory'

export default class ConditionGroup extends Condition {
  constructor(world, config) {
    super(world)

    this.config = config
    this.conditions = []
    this.operators = []

    let conf = config.slice(0)
    if (conf.length > 0) {
      this.addCondition(conf.shift())
      while (conf.length > 0) {
        this.operators.push(conf.shift())
        this.addCondition(conf.shift())
      }
    }
  }

  addCondition(condition) {
    if (typeof condition === 'string') {
      condition = ConditionFactory.build(condition, this.world)
      this.conditions.push(condition)
    } else if (typeof condition === 'object') {
      if (typeof condition.step === 'function' &&
        typeof condition.check === 'function' &&
        typeof condition.getReason === 'function') {
        condition.world = this.world
        this.conditions.push(condition)
      } else if (condition.type !== undefined) {
        let config = condition.config ? condition.config : {}
        condition = ConditionFactory.build(condition.type, this.world, config)
        this.conditions.push(condition)
      }
    }
  }

  step() {
    this.conditions.forEach(condition => condition.step())
  }

  check() {
    return !!this.getReason()
  }

  getReason() {
    if (this.conditions.length === 0) {
      return null
    }

    let accumulator = []
    this.conditions.forEach((condition, index) => {
      if (index > 0) {
        accumulator.push(this.operators[index - 1])
      }
      accumulator.push({
        value: condition.check(),
        reason: condition.getReason()
      })
    })

    for (let i = 0; i < accumulator.length; i++) {
      if (accumulator[i] === 'and') {
        let value = accumulator[i - 1].value && accumulator[i + 1].value
        let reason = accumulator[i - 1].value ? accumulator[i - 1].reason : accumulator[i + 1].reason
        accumulator.splice(i - 1, 3, {
          value,
          reason
        })
        i--
      }
    }

    for (let i = 0; accumulator.length > 1; i++) {
      if (accumulator[i] === 'or') {
        let value = accumulator[i - 1].value || accumulator[i + 1].value
        let reason = accumulator[i - 1].value ? accumulator[i - 1].reason : accumulator[i + 1].reason
        accumulator.splice(i - 1, 3, {
          value,
          reason
        })
        i--
      }
    }

    return accumulator[0].value ? accumulator[0].reason : null
  }
}