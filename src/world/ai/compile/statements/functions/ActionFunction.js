import PrimaryStatement from '../PrimaryStatement'
import FunctionMixin from './FunctionMixin'
import {
  MismatchStatementException,
  ForbiddenActionFunctionException,
  UnknownFunctionException,
  InvalidFunctionParamsException
} from '../../CompilerException'

class ActionFunction extends PrimaryStatement {
  constructor(type, parent, line, column) {
    super(type, parent, line, column)
    this.params = this.getParamTypes().map(type => null)
  }

  static get keyword() {
    return this.hasOwnProperty('_keyword') ? this._keyword : undefined
  }

  static set keyword(keyword) {
    this._keyword = keyword
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  compile(config, context) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(ActionFunction.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as an action function a statement which is not one', this, {
        template: 'exception_mismatch_function_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          }
        }
      })
    }

    let allowedTypes = config.actionFunctions
    if (!allowedTypes.some(allowedType => this instanceof allowedType)) {
      throw new ForbiddenActionFunctionException(`the function ${this.constructor.keyword} is forbidden. You may use the following functions: ${allowedTypes}`, this, {
        template: 'exception_forbidden_action_function_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          },
          allowedFunctions: allowedTypes.map(func => func.keyword)
        }
      })
    }
  }

}

ActionFunction.startLineRegExp = /^\s*((\w+)\s*\((.*)\))/
ActionFunction.codeRegExp = /^\s*((\w+)\s*\((.*)\))\s*$/

Object.assign(ActionFunction.prototype, FunctionMixin);

export default ActionFunction