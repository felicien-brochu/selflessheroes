import Expression from '../Expression'
import ExpressionValue from '../ExpressionValue'
import {
  MismatchStatementException,
  ForbiddenObjectTypeLiteralException
} from '../../CompilerException'
import Direction from '../../../../Direction'

export default class DirectionLiteral extends Expression {
  constructor(line, column) {
    super('DirectionLiteral', line, column)
    this.name = null
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(DirectionLiteral.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a type literal a statement which is not one', this)
    }

    this.name = joinedCode.trim()
  }

  static isValid(code) {
    let name = code.trim()
    return !!name.match(DirectionLiteral.codeRegExp) && !!Direction[name]
  }

  computeValue(context) {
    return ExpressionValue.direction(Direction[this.name])
  }
}

DirectionLiteral.codeRegExp = /^\s*(\w+)\s*$/