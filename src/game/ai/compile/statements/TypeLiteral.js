import Expression from './Expression'
import {
  MismatchStatementException
} from '../exceptions/CompilerException'

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
const codeRegExp = /^\s*(\w+)\s*$/

export default class TypeLiteral extends Expression {
  constructor(line, column) {
    super('TypeLiteral', line, column)
    this.name = null
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(codeRegExp)
    if (!res) {
      throw new MismatchStatementException('You try to compile as a type literal a statement which is not one', this)
    }

    this.name = joinedCode.trim()

    if (!config.types.some(type => this.name === type)) {
      throw new ForbiddenTypeLiteralException(`The type literal ${this.name} is forbidden. You may use the following types: ${config.types}.`, this)
    }
  }

  static isValid(code) {
    let name = code.trim()
    return !!name.match(codeRegExp) && types.some(type => name === type)
  }
}