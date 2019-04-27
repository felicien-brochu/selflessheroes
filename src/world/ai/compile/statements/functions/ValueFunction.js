import Expression from '../Expression'
import FunctionMixin from './FunctionMixin'
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

class ValueFunction extends Expression {
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

  compile(config, context) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(ValueFunction.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a value function a statement which is not one', this, {
        template: 'exception_mismatch_function_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          }
        }
      })
    }

    let allowedTypes = config.valueFunctions
    if (!allowedTypes.some(allowedType => this instanceof allowedType)) {
      throw new ForbiddenValueFunctionException(`the function ${this.constructor.keyword} is forbidden. You may use the following functions: ${allowedTypes}`, this, {
        template: 'exception_forbidden_value_function_template',
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

ValueFunction.codeRegExp = /^\s*((\w+)\s*\((.*)\))\s*$/

Object.assign(ValueFunction.prototype, FunctionMixin);

export default ValueFunction