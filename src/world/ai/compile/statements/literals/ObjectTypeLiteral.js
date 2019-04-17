import Expression from '../Expression'
import ExpressionValue from '../ExpressionValue'
import {
  MismatchStatementException,
  ForbiddenObjectTypeLiteralException
} from '../../CompilerException'
import {
  NotDecompilableStatementException
} from '../../DecompilerException'
import ObjectType from '../../../../ObjectType'

export default class ObjectTypeLiteral extends Expression {
  constructor(parent, line, column) {
    super('ObjectTypeLiteral', parent, line, column)
    this.name = null
    this.value = null
  }

  compile(config, context) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(ObjectTypeLiteral.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a type literal a statement which is not one', this)
    }

    this.name = joinedCode.trim()

    if (!config.objectTypes.some(type => this.name === type)) {
      throw new ForbiddenObjectTypeLiteralException(`the object type literal '${this.name}' is forbidden. You may use the following object types: ${config.objectTypes}`, this)
    }

    this.value = ObjectType[this.name]
  }

  decompile(indent, line, column) {
    super.decompile(indent, line, column)

    if (!this.name) {
      throw new NotDecompilableStatementException('this object type literal has no name', this)
    }
    this.code = [this.name]

    return true
  }

  static isValid(code) {
    let name = code.trim()
    return !!name.match(ObjectTypeLiteral.codeRegExp) && !!ObjectType[name]
  }

  computeValue(context) {
    return ExpressionValue.objectType(this.value)
  }
}

ObjectTypeLiteral.codeRegExp = /^\s*(\w+)\s*$/