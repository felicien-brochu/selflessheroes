import FunctionExpression from './FunctionExpression'
import DirectionLiteral from '../literals/DirectionLiteral'
import Direction from '../../../../Direction'
import StepAction from '../../../../actions/StepAction'
import {
  InvalidNumberOfParamsException,
  InvalidFunctionParamsException
} from '../../CompilerException'

export default class StepFunction extends FunctionExpression {
  constructor(parent, line, column) {
    super('StepFunction', parent, line, column)
  }

  getParamTypes() {
    return [
      [{
        type: DirectionLiteral,
        multiple: true,
        notHere: true
      }]
    ]
  }

  computeValue(context) {
    let r = context.rng()
    let dir = Direction.here

    for (let i = 0; i < this.params.length; i++) {
      if (r < 1 * ((i + 1) / this.params.length)) {
        dir = this.params[i].value
        break
      }
    }

    return {
      step: true,
      complete: true,
      goto: null,
      action: new StepAction(dir)
    }
  }

  onInvalidNumberOfParams(rawParams, config, context) {
    throw new InvalidNumberOfParamsException('\'step\' function requires at least 1 parameter', this, {
      template: 'exception_invalid_params_one_more_dir_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        },
        directions: Direction.names.filter(dir => dir !== 'here')
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
        allowedValues: Direction.names.filter(dir => dir !== 'here')
      }
    })
  }
}

StepFunction.keyword = 'step'