import ActionFunction from './ActionFunction'
import IntegerLiteral from '../literals/IntegerLiteral'
import VariableIdentifier from '../VariableIdentifier'
import ExpressionTypes from '../ExpressionTypes'
import Direction from '../../../../Direction'
import WriteAction from '../../../../actions/WriteAction'
import {
  MismatchStatementException,
  InvalidNumberOfParamsException,
  InvalidFunctionParamsException
} from '../../CompilerException'
import {
  createUnitExpression,
  extractParams
} from '../../utils'

export default class WriteFunction extends ActionFunction {
  constructor(parent, line, column) {
    super('WriteFunction', parent, line, column)
  }

  getParamTypes() {
    return [
      [{
        type: IntegerLiteral
      }, {
        type: VariableIdentifier
      }]
    ]
  }

  compile(config, context) {
    super.compile(config, context)

    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(WriteFunction.correctCodeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a write function a statement which is not one', this, {
        template: 'exception_mismatch_function_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          }
        }
      })
    }

    let paramsJoinedCode = res[2]
    let params = extractParams(paramsJoinedCode, this.code, this.line, this.column)

    if (params.length !== 1) {
      throw new InvalidNumberOfParamsException('\'write\' function requires exactly 1 integer literal or variable identifier parameter', this, {
        template: 'exception_invalid_params_one_integer_or_variable_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          }
        }
      })
    }

    this.params = []
    params.forEach((param, index) => this.compileParam(param, index, config, context))
  }

  compileParam(paramCode, index, config, context) {
    let param = createUnitExpression(paramCode.code, [IntegerLiteral, VariableIdentifier], this, paramCode.line, paramCode.column)
    this.params.push(param)

    if (param.type === 'InvalidExpression') {
      throw new InvalidFunctionParamsException(`'${param.code.join(' ').trim()}' is not a valid integer literal or variable identifier`, param, {
        template: 'exception_invalid_integer_or_variable_param_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          },
          param: param.code.join(' ').trim()
        }
      })
    }

    param.compile(config, context)
  }

  execute(context) {
    return {
      step: true,
      complete: true,
      goto: null,
      action: new WriteAction(this.params[0].computeValue(context))
    }
  }
}

WriteFunction.keyword = 'write'
WriteFunction.startLineRegExp = /^\s*(write\s*\((.*)\))\s*/
WriteFunction.correctCodeRegExp = /^\s*(write\s*\((.*)\))\s*$/
WriteFunction.codeRegExp = /^\s*(write\s*\((.*)\)).*$/