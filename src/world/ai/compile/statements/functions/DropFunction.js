import FunctionExpression from './FunctionExpression'
import DirectionLiteral from '../literals/DirectionLiteral'
import Direction from '../../../../Direction'
import DropAction from '../../../../actions/DropAction'
import {
  InvalidNumberOfParamsException,
  InvalidFunctionParamsException
} from '../../CompilerException'

export default class DropFunction extends FunctionExpression {
  constructor(parent, line, column) {
    super('DropFunction', parent, line, column)
  }

  getParamTypes() {
    return [
      [{
        type: DirectionLiteral,
        multiple: false,
      }]
    ]
  }

  computeValue(context) {
    return {
      step: true,
      complete: true,
      goto: null,
      action: new DropAction(this.params[0].value)
    }
  }

  onInvalidNumberOfParams(rawParams, config, context) {
    throw new InvalidNumberOfParamsException('\'drop\' function requires exactly 1 parameter', this, {
      template: 'exception_invalid_params_one_dir_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        },
        directions: Direction.names
      }
    })
  }

  onInvalidParam(index, param, config, context) {
    throw new InvalidFunctionParamsException(`'${param.code.join(' ').trim()}' is not a valid direction literal`, param, {
      template: 'exception_invalid_direction_param_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        },
        param: param.code.join(' ').trim(),
        allowedValues: Direction.names
      }
    })
  }
}

DropFunction.keyword = 'drop'