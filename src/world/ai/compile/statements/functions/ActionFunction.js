import PrimaryStatement from '../PrimaryStatement'
import {
  MismatchStatementException,
  ForbiddenActionFunctionException,
  UnknownFunctionException,
  InvalidFunctionParamsException
} from '../../CompilerException'

export default class ActionFunction extends PrimaryStatement {
  constructor(type, parent, keyword, line, column) {
    super(type, parent, line, column)
    this.keyword = keyword
    this.params = this.getParamTypes().map(type => null)
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
    if (!allowedTypes.some(allowedType => this instanceof allowedType)) {
      throw new ForbiddenActionFunctionException(`the function ${this.keyword} is forbidden. You may use the following functions: ${allowedTypes}`, this)
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

    let paramType = paramTypes.find(type => param instanceof type.type || (Array.isArray(param) && type.multiple && param[0] instanceof type.type))
    return paramType
  }
}

ActionFunction.startLineRegExp = /^\s*((\w+)\s*\((.*)\))/
ActionFunction.codeRegExp = /^\s*((\w+)\s*\((.*)\))\s*$/