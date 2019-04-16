import Statement from './Statement'
import {
  InvalidStatementException
} from '../CompilerException'
import {
  NotDecompilableStatementException
} from '../DecompilerException'

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

  decompile(indent, line, column) {
    throw new NotDecompilableStatementException('tried to decompile an InvalidStatement', this)
  }

  static isValid(code) {
    return false
  }
}