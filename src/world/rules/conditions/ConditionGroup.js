import Condition from './Condition'
import ConditionFactory from './ConditionFactory'

export default class ConditionGroup extends Condition {
  constructor(config, trustedSource = false) {
    super()

    this.config = config
    this.trustedSource = trustedSource
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

  addCondition(conditionConfig) {
    let condition = ConditionFactory.build(conditionConfig, this.trustedSource)
    this.conditions.push(condition)
  }

  beforeStart(world) {
    this.conditions.forEach(condition => condition.beforeStart(world))
  }

  step(world) {
    this.conditions.forEach(condition => condition.step(world))
  }

  check(world) {
    return this.getConditionsCheck(world).value
  }

  getConditionsCheck(world) {
    if (this.conditions.length === 0) {
      return {
        value: false,
        condition: null
      }
    }

    let accumulator = []
    this.conditions.forEach((condition, index) => {
      if (index > 0) {
        accumulator.push(this.operators[index - 1])
      }
      accumulator.push({
        value: condition.check(world),
        condition: condition
      })
    })

    for (let i = 0; i < accumulator.length; i++) {
      if (accumulator[i] === 'and') {
        let value = accumulator[i - 1].value && accumulator[i + 1].value
        let condition = accumulator[i - 1].value ? accumulator[i - 1].condition : accumulator[i + 1].condition
        accumulator.splice(i - 1, 3, {
          value,
          condition
        })
        i--
      }
    }

    for (let i = 0; accumulator.length > 1; i++) {
      if (accumulator[i] === 'or') {
        let value = accumulator[i - 1].value || accumulator[i + 1].value
        let condition = accumulator[i - 1].value ? accumulator[i - 1].condition : accumulator[i + 1].condition
        accumulator.splice(i - 1, 3, {
          value,
          condition
        })
        i--
      }
    }

    return accumulator[0]
  }

  getReason(world) {
    let condition = this.getConditionsCheck(world)
    return condition.value ? condition.condition.getReason(world) : null
  }
}