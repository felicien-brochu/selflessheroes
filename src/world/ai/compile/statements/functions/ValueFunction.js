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
  constructor(type, parent, keyword, line, column) {
    super(type, parent, line, column)
    this.params = this.getParamTypes().map(type => null)
    this.keyword = keyword
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(ValueFunction.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a value function a statement which is not one', this)
    }

    let allowedTypes = config.valueFunctions
    if (!allowedTypes.some(allowedType => this instanceof allowedType)) {
      throw new ForbiddenValueFunctionException(`the function ${this.keyword} is forbidden. You may use the following functions: ${allowedTypes}`, this)
    }
  }

  getParamTypes() {
    throw new Error('Needs subclass implementation.')
  }

  getParamCurrentType(index) {
    return this.getParamTypeAt(this.params[index], index)
  }

  getParamTypeAt(param, index) {
    let types = this.getParamTypes()
    let paramTypes
    if (index >= types.length) {
      paramTypes = types[types.length - 1]
    } else {
      paramTypes = types[index]
    }

    let paramType = paramTypes.find(type => param instanceof type.type)
    return paramType
  }
}

ValueFunction.codeRegExp = /^\s*((\w+)\s*\((.*)\))\s*$/