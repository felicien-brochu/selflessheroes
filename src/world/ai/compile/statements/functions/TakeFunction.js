import FunctionExpression from './FunctionExpression'
import DirectionLiteral from '../literals/DirectionLiteral'
import Direction from '../../../../Direction'
import TakeAction from '../../../../actions/TakeAction'
import {
  InvalidNumberOfParamsException,
  InvalidFunctionParamsException
} from '../../CompilerException'

export default class TakeFunction extends FunctionExpression {
  constructor(parent, line, column) {
    super('TakeFunction', parent, line, column)
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
      action: new TakeAction(this.params[0].value)
    }
  }

  onInvalidNumberOfParams(config) {
    throw new InvalidNumberOfParamsException('\'take\' function requires exactly 1 direction parameter', this, {
      template: 'exception_invalid_params_one_dir_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        },
        directions: Direction.names
      }
    })
  }

  onInvalidParam(index, param, config) {
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

TakeFunction.keyword = 'take'