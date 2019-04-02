import Expression from '../Expression'
import {
  MismatchStatementException,
  ForbiddenValueFunctionException,
  UnknownFunctionException,
  InvalidFunctionParamsException
} from '../../CompilerException'
import {
  splitCode,
  subCode,
  indexOfStringInLines
} from '../../utils'

export default class ValueFunction extends Expression {
  constructor(type, identifier, line, column) {
    super(type, line, column)
    this.params = []
    this.identifier = identifier
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(ValueFunction.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a value function a statement which is not one', this)
    }

    let allowedTypes = config.valueFunctions
    if (!allowedTypes.some(allowedType => allowedType === this.identifier)) {
      throw new ForbiddenValueFunctionException(`the function ${this.identifier} is forbidden. You may use the following functions: ${allowedTypes}`, this)
    }
  }
}

ValueFunction.codeRegExp = /^\s*((\w+)\s*\((.*)\))\s*$/