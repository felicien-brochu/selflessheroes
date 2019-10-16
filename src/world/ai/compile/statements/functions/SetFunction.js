import FunctionExpression from './FunctionExpression'
import VariableIdentifier from '../VariableIdentifier'
import DirectionLiteral from '../literals/DirectionLiteral'
import IntegerLiteral from '../literals/IntegerLiteral'
import MyItemLiteral from '../literals/MyItemLiteral'
import {
  InvalidNumberOfParamsException,
  InvalidFunctionParamsException
} from '../../CompilerException'

export default class SetFunction extends FunctionExpression {
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

  computeValue(context) {
    let computedValue = this.params[0].computeValue(context)

    context.calculation.type = 'set'
    context.calculation.operands.push({
      type: 'value',
      value: computedValue,
    })
    return computedValue
  }

  onInvalidNumberOfParams(rawParams, config, context) {
    throw new InvalidNumberOfParamsException('\'set\' function requires exactly 1 parameter', this, {
      template: 'exception_invalid_params_one_dir_integer_variable_myitem_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        }
      }
    })
  }

  onInvalidParam(index, param, config, context) {
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
}

SetFunction.keyword = 'set'