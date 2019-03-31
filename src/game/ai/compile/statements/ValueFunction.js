import Expression from './Expression'
import DirFunction from './functions/DirFunction'
import {
  MismatchStatementException,
  ForbiddenValueFunctionException,
  UnknownFunctionException,
  InvalidFunctionParamsException
} from '../CompilerException'

const codeRegExp = /^\s*((\w+)\s*\((.*)\))\s*$/

export const valueFunctions = [
  DirFunction
]

export default class ValueFunction extends Expression {
  constructor(line, column) {
    super('ValueFunction', line, column)
    this.func = null
    this.identifier = null
    this.params = []
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a value function a statement which is not one', this)
    }

    let allowedTypes = config.valueFunctions
    this.identifier = res[2]

    if (!allowedTypes.some(allowedType => allowedType === this.identifier)) {
      throw new ForbiddenValueFunctionException(`the function ${this.identifier} is forbidden. You may use the following functions: ${allowedTypes}`, this)
    }

    this.func = valueFunctions.find(funcClass => funcClass.getIdentifier() === this.identifier)
    if (!this.func) {
      throw new UnknownFunctionException(`the function '${this.identifier}()' is unknown. You may use the following functions: ${allowedTypes}`, this)
    }

    let params = res[3].split(',')
    this.params = params.map(param => param.trim())

    if (!this.func.checkParams(this.params, config)) {
      throw new InvalidFunctionParamsException(`the function '${this.identifier}()' does not accept this kind of parameters: ${this.params}`, this)
    }
  }

  static isValid(code) {
    return codeRegExp.test(code.trim())
  }
}