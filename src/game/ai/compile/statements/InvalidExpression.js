import Expression from './Expression'
import {
  InvalidExpressionException
} from '../exceptions/CompilerException'

export default class InvalidExpression extends Expression {
  constructor(line, column) {
    super('InvalidExpression', line, column)
  }

  compile(config) {
    throw new InvalidExpressionException('Invalid expression.', this)
  }

  static isValid(code) {
    return false
  }
}