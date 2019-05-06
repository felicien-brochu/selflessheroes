import Expression from '../Expression'
import ExpressionValue from '../ExpressionValue'
import {
  MismatchStatementException
} from '../../CompilerException'

export const addOperator = '+'
export const substractOperator = '-'
export const multiplyOperator = '*'
export const divideOperator = '/'
export const moduloOperator = '%'

export const arithmeticOperators = [
  addOperator,
  substractOperator,
  multiplyOperator,
  divideOperator,
  moduloOperator
]

export default class ArithmeticOperatorLiteral extends Expression {
  constructor(parent, line, column) {
    super('ArithmeticOperatorLiteral', parent, line, column)
    this.operator = null
  }

  compile(config, context) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(ArithmeticOperatorLiteral.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as an arithmetic operator literal a statement which is not one', this)
    }

    this.operator = res[1]
  }

  decompile(indent, line, column) {
    super.decompile(indent, line, column)

    this.code = [`${this.operator}`]

    return true
  }

  computeValue(context) {
    return this.operator
  }
}

ArithmeticOperatorLiteral.codeRegExp = /^\s*([+\-*/%])\s*$/