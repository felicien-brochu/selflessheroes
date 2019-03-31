import Expression from './Expression'
import {
  MismatchStatementException,
  ForbiddenVariableIdentifierException
} from '../CompilerException'

const codeRegExp = /^\s*([a-z])\s*$/

export default class VariableIdentifier extends Expression {
  constructor(line, column) {
    super('VariableIdentifier', line, column)
    this.name = null
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a variable a statement which is not one', this)
    }

    this.name = joinedCode.trim()
    let allowedNames = config.getAllowedVariableIdentifiers()

    if (!allowedNames.some(allowedName => allowedName === this.name)) {
      throw new ForbiddenVariableIdentifierException(`the variable name ''${this.name}' is forbidden. You may choose between the following names: ${allowedNames}`, this)
    }
  }

  static isValid(code) {
    let name = code.trim()
    return codeRegExp.test(name)
  }
}