import PrimaryStatement from './PrimaryStatement'
import StepFunction from './functions/StepFunction'
import {
  MismatchStatementException,
  ForbiddenValueFunctionException,
  UnknownFunctionException,
  InvalidFunctionParamsException
} from '../exceptions/CompilerException'

const startLineRegExp = /^\s*((\w+)\s*\((.*)\))/
const codeRegExp = /^\s*((\w+)\s*\((.*)\))\s*$/

export const actionFunctions = [
  StepFunction
]

export default class ActionFunction extends PrimaryStatement {
  constructor(line, column) {
    super('ActionFunction', line, column)
    this.func = null
    this.identifier = null
    this.params = []
  }

  static matchLine(line) {
    return startLineRegExp.test(line)
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(codeRegExp)
    if (!res) {
      throw new MismatchStatementException('You try to compile as a value function a statement which is not one', this)
    }

    let allowedTypes = config.actions
    this.identifier = res[2]

    if (!allowedTypes.some(allowedType => allowedType === this.identifier)) {
      throw new ForbiddenValueFunctionException(`The function ${this.identifier} is forbidden. You may use the following functions: ${allowedTypes}.`, this)
    }

    this.func = actionFunctions.find(funcClass => funcClass.getIdentifier() === this.identifier)
    if (!this.func) {
      throw new UnknownFunctionException(`The function '${this.identifier}()' is unknown. You may use the following functions: ${allowedTypes}.`, this)
    }

    let params = res[3].split(',')
    this.params = params.map(param => param.trim())

    if (!this.func.checkParams(this.params, config)) {
      throw new InvalidFunctionParamsException(`The function '${this.identifier}()' does not accept this kind of parameters: ${this.params}`, this)
    }
  }

  static isValid(code) {
    return codeRegExp.test(code.trim())
  }
}