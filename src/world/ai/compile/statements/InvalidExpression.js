import Expression from './Expression'
import {
  InvalidExpressionException
} from '../CompilerException'
import {
  NotDecompilableStatementException
} from '../DecompilerException'

export default class InvalidExpression extends Expression {
  constructor(parent, line, column) {
    super('InvalidExpression', parent, line, column)
  }

  compile(config) {
    throw new InvalidExpressionException('invalid expression', this)
  }

  decompile(indent, line, column) {
    throw new NotDecompilableStatementException('tried to decompile an InvalidExpression', this)
  }

  static isValid(code) {
    return false
  }
}