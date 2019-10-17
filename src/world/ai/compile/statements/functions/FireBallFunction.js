import FunctionExpression from './FunctionExpression'
import DirectionLiteral from '../literals/DirectionLiteral'
import Direction from '../../../../Direction'
import FireBallAction from '../../../../actions/FireBallAction'
import {
  InvalidNumberOfParamsException,
  InvalidFunctionParamsException
} from '../../CompilerException'

export default class FireBallFunction extends FunctionExpression {
  constructor(parent, line, column) {
    super('FireBallFunction', parent, line, column)
  }

  getParamTypes() {
    return [
      [{
        type: DirectionLiteral,
        multiple: false,
        validator: DirectionLiteral.notHereValidator,
      }]
    ]
  }

  computeValue(context) {
    return {
      step: true,
      complete: true,
      goto: null,
      action: new FireBallAction(this.params[0].value)
    }
  }

  onInvalidNumberOfParams(config) {
    throw new InvalidNumberOfParamsException('\'fireball\' function requires exactly 1 direction parameter', this, {
      template: 'exception_invalid_params_one_dir_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        },
        directions: Direction.names.filter(dir => dir !== 'here')
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
        allowedValues: Direction.names.filter(dir => dir !== 'here')
      }
    })
  }

  onParamValidationFailed(index, param, config) {
    throw new InvalidFunctionParamsException(`'the '${this.constructor.keyword}' function does not accept 'here' param as a direction`, param, {
      template: 'exception_invalid_direction_param_not_here_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        },
        param: param.code.join(' ').trim(),
        allowedValues: Direction.names.filter(dir => dir !== 'here')
      }
    })
  }
}

FireBallFunction.keyword = 'fireball'