import Expression from './Expression'
import {
  InvalidExpressionException
} from '../CompilerException'

export default class InvalidExpression extends Expression {
  constructor(parent, line, column) {
    super('InvalidExpression', parent, line, column)
  }

  compile(config) {
    throw new InvalidExpressionException('invalid expression', this)
  }

  static isValid(code) {
    return false
  }
}