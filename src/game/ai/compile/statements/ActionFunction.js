import PrimaryStatement from './PrimaryStatement'
import {
  MismatchStatementException,
  ForbiddenActionFunctionException,
  UnknownFunctionException,
  InvalidFunctionParamsException
} from '../CompilerException'

export default class ActionFunction extends PrimaryStatement {
  constructor(type, identifier, line, column) {
    super(type, line, column)
    this.identifier = identifier
    this.params = []
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(ActionFunction.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a value function a statement which is not one', this)
    }

    let allowedTypes = config.actionFunctions
    this.identifier = res[2]

    if (!allowedTypes.some(allowedType => allowedType === this.identifier)) {
      throw new ForbiddenActionFunctionException(`the function ${this.identifier} is forbidden. You may use the following functions: ${allowedTypes}`, this)
    }
  }
}

ActionFunction.startLineRegExp = /^\s*((\w+)\s*\((.*)\))/
ActionFunction.codeRegExp = /^\s*((\w+)\s*\((.*)\))\s*$/