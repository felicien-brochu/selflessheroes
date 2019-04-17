import Expression from '../Expression'
import {
  MismatchStatementException
} from '../../CompilerException'

export const undefinedLiteralKeyword = 'undefined'

export default class UndefinedLiteral extends Expression {
  constructor(parent, line, column) {
    super('UndefinedLiteral', parent, line, column)
  }

  compile(config, context) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(UndefinedLiteral.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as an undefined literal a statement which is not one', this)
    }

    context.undefinedLiterals.push(this)
  }

  decompile(indent, line, column) {
    super.decompile(indent, line, column)

    this.code = [undefinedLiteralKeyword]

    return false
  }

  computeValue(context) {
    throw new Error('you cannot compute/execute an UndefinedLiteral value')
  }
}

UndefinedLiteral.codeRegExp = new RegExp(`^\\s*(${undefinedLiteralKeyword})\\s*$`)