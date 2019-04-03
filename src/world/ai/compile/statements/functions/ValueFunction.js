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
    this.params = []
    this.keyword = keyword
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(ValueFunction.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a value function a statement which is not one', this)
    }

    let allowedTypes = config.getValueFunctionsForParent(this.parent)
    if (!allowedTypes.some(allowedType => this instanceof allowedType)) {
      throw new ForbiddenValueFunctionException(`the function ${this.keyword} is forbidden. You may use the following functions: ${allowedTypes}`, this)
    }
  }
}

ValueFunction.codeRegExp = /^\s*((\w+)\s*\((.*)\))\s*$/