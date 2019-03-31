import Expression from './Expression'
import {
  MismatchStatementException
} from '../CompilerException'

const codeRegExp = /^\s*(\d+)\s*$/

export default class IntegerLiteral extends Expression {
  constructor(line, column) {
    super('IntegerLiteral', line, column)
    this.value = 0
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as an integer literal a statement which is not one', this)
    }

    this.value = parseInt(res[1], 10)
  }

  static isValid(code) {
    return !!code.match(codeRegExp)
  }
}