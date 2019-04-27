import PrimaryStatement from './PrimaryStatement'
import {
  InvalidStatementException
} from '../CompilerException'
import {
  NotDecompilableStatementException
} from '../DecompilerException'

export default class InvalidStatement extends PrimaryStatement {
  constructor(parent, line, column) {
    super('InvalidStatement', parent, line, column)
  }

  compile(config, context) {
    throw new InvalidStatementException('invalid statement', this, {
      template: 'exception_invalid_statement_template',
      values: {
        code: this.code.join(' ').trim()
      }
    })
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