import ValueFunction from './ValueFunction'
import ExpressionValue from '../ExpressionValue'
import ExpressionTypes from '../ExpressionTypes'
import VariableIdentifier from '../VariableIdentifier'
import DirectionLiteral from '../literals/DirectionLiteral'
import IntegerLiteral from '../literals/IntegerLiteral'
import MyItemLiteral from '../literals/MyItemLiteral'
import Direction from '../../../../Direction'
import {
  MismatchStatementException,
  InvalidNumberOfParamsException,
  InvalidFunctionParamsException
} from '../../CompilerException'
import {
  createUnitExpression,
  extractParams
} from '../../utils'

export default class SetFunction extends ValueFunction {
  constructor(parent, line, column) {
    super('SetFunction', parent, line, column)
  }

  getParamTypes() {
    return [
      [{
        type: DirectionLiteral,
        multiple: false
      }, {
        type: IntegerLiteral
      }, {
        type: MyItemLiteral
      }, {
        type: VariableIdentifier
      }]
    ]
  }

  compile(config, context) {
    super.compile(config, context)

    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(SetFunction.correctCodeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a set function a statement which is not one', this, {
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
      throw new InvalidNumberOfParamsException('\'set\' function requires exactly 1 parameter', this, {
        template: 'exception_invalid_params_one_dir_integer_variable_myitem_template',
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
    let param = createUnitExpression(paramCode.code, [DirectionLiteral, IntegerLiteral, VariableIdentifier, MyItemLiteral], this, paramCode.line, paramCode.column)
    this.params.push(param)

    if (param.type === 'InvalidExpression') {
      throw new InvalidFunctionParamsException(`\'set\' function requires 1 parameter of type DirectionLiteral, IntegerLiteral, VariableIdentifier or MyItemLiteral`, param, {
        template: 'exception_invalid_dir_integer_variable_myitem_param_template',
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

  computeValue(context) {
    let computedValue = this.params[0].computeValue(context)

    context.calculation.type = 'set'
    context.calculation.operands.push({
      type: 'value',
      value: computedValue,
    })
    return computedValue
  }
}

SetFunction.keyword = 'set'
SetFunction.correctCodeRegExp = /^\s*(set\s*\((.*)\))\s*$/
SetFunction.codeRegExp = /^\s*(set\s*\((.*)\)).*$/