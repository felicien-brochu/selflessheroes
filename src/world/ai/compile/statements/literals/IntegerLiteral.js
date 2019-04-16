import Expression from '../Expression'
import ExpressionValue from '../ExpressionValue'
import {
  MismatchStatementException
} from '../../CompilerException'

export default class IntegerLiteral extends Expression {
  constructor(parent, line, column) {
    super('IntegerLiteral', parent, line, column)
    this.value = 0
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(IntegerLiteral.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as an integer literal a statement which is not one', this)
    }

    this.value = parseInt(res[1], 10)
  }

  decompile(indent, line, column) {
    super.decompile(indent, line, column)

    this.code = [`${this.value}`]

    return true
  }

  computeValue(context) {
    return ExpressionValue.integer(this.value)
  }
}

IntegerLiteral.codeRegExp = /^\s*(\d+)\s*$/