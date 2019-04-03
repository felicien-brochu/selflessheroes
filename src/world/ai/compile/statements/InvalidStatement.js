import Statement from './Statement'
import {
  InvalidStatementException
} from '../CompilerException'

export default class InvalidStatement extends Statement {
  constructor(parent, line, column) {
    super('InvalidExpression', parent, line, column)
  }

  compile(config) {
    throw new InvalidStatementException('invalid statement', this)
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  static isValid(code) {
    return false
  }
}