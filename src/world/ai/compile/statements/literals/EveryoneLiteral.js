import Expression from '../Expression'
import {
  MismatchStatementException,
  ForbiddenExpressionTypeException,
} from '../../CompilerException'
import {
  NotDecompilableStatementException
} from '../../DecompilerException'

export default class EveryoneLiteral extends Expression {
  constructor(parent, line, column) {
    super('EveryoneLiteral', parent, line, column)
  }

  compile(config, context) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(EveryoneLiteral.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a everyone literal a statement which is not one', this)
    }

    if (!config.isExpressionTypeAvailable(this.constructor)) {
      throw new ForbiddenExpressionTypeException(`'${this.code.join(' ').trim()}' EveryoneLiteral are not available.`, this, {
        template: 'exception_forbidden_everyone_literal_type_template',
      })
    }
  }

  decompile(indent, line, column) {
    super.decompile(indent, line, column)

    this.code = ['everyone']

    return true
  }

  static isValid(code) {
    let name = code.trim()
    return !!name.match(EveryoneLiteral.codeRegExp)
  }

  computeValue(context) {
    return this.type
  }
}

EveryoneLiteral.codeRegExp = /^\s*(everyone)\s*$/