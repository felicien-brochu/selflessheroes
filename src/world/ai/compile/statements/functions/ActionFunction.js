import PrimaryStatement from '../PrimaryStatement'
import FunctionMixin from './FunctionMixin'
import {
  MismatchStatementException,
  ForbiddenActionFunctionException,
  UnknownFunctionException,
  InvalidFunctionParamsException
} from '../../CompilerException'

class ActionFunction extends PrimaryStatement {
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

}

ActionFunction.startLineRegExp = /^\s*((\w+)\s*\((.*)\))/
ActionFunction.codeRegExp = /^\s*((\w+)\s*\((.*)\))\s*$/

Object.assign(ActionFunction.prototype, FunctionMixin);

export default ActionFunction