import Expression from './Expression'
import ExpressionValue from './ExpressionValue'
import {
  MismatchStatementException
} from '../CompilerException'

export const typeEmpty = 'empty'
export const typeWall = 'wall'
export const typeHole = 'hole'
export const typeHero = 'hero'

export const types = [
  typeEmpty,
  typeWall,
  typeHole,
  typeHero
]

export default class ObjectTypeLiteral extends Expression {
  constructor(line, column) {
    super('ObjectTypeLiteral', line, column)
    this.name = null
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(ObjectTypeLiteral.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a type literal a statement which is not one', this)
    }

    this.name = joinedCode.trim()

    if (!config.objectTypes.some(type => this.name === type)) {
      throw new ForbiddenObjectTypeLiteralException(`the type literal ${this.name} is forbidden. You may use the following object types: ${config.objectTypes}`, this)
    }
  }

  static isValid(code) {
    let name = code.trim()
    return !!name.match(ObjectTypeLiteral.codeRegExp) && types.some(type => name === type)
  }

  computeValue(context) {
    return ExpressionValue.objectType(this.name)
  }
}

ObjectTypeLiteral.codeRegExp = /^\s*(\w+)\s*$/