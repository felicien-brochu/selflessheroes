import Expression from '../Expression'
import ExpressionValue from '../ExpressionValue'
import ObjectType from '../../../../ObjectType'
import {
  MismatchStatementException
} from '../../CompilerException'

export default class MyItemLiteral extends Expression {
  constructor(parent, line, column) {
    super('MyItemLiteral', parent, line, column)
  }

  compile(config, context) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(MyItemLiteral.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a myitem literal a statement which is not one', this)
    }
  }

  decompile(indent, line, column) {
    super.decompile(indent, line, column)

    this.code = ['myitem']

    return true
  }

  static isValid(code) {
    let name = code.trim()
    return !!name.match(MyItemLiteral.codeRegExp)
  }

  computeValue(context) {
    if (context.character.item) {
      return ExpressionValue.object(context.character.item.shallowCopy())
    } else {
      return ExpressionValue.objectType(ObjectType.nothing)
    }
  }
}

MyItemLiteral.codeRegExp = /^\s*(myitem)\s*$/