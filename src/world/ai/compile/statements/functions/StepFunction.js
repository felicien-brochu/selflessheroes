import FunctionExpression from './FunctionExpression'
import DirectionLiteral from '../literals/DirectionLiteral'
import VariableIdentifier from '../VariableIdentifier'
import WorldObjectFinder from '../../../WorldObjectFinder'
import Direction from '../../../../Direction'
import StepAction from '../../../../actions/StepAction'
import WaitAction from '../../../../actions/WaitAction'
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
        validator: DirectionLiteral.notHereValidator,
      }, {
        type: VariableIdentifier,
      }]
    ]
  }

  computeValue(context) {
    if (this.params[0] instanceof DirectionLiteral) {
      return this.stepToDirection(context)
    } else if (this.params[0] instanceof VariableIdentifier) {
      return this.stepToVariable(context)
    }
  }

  stepToDirection(context) {
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

  stepToVariable(context) {
    let complete = true
    let step = true
    let action = new WaitAction()

    let variable = this.params[0].computeValue(context)
    let objectValue = variable.getFirstObjectValue()

    if (!!objectValue) {
      let target = objectValue.value

      // If we arrived at destination
      if (WorldObjectFinder.hasArrivedAtObject(context.character, target)) {
        if (context.character.ai.lastActionCursor === context.character.ai.cursor) {
          step = false
          action = null
        }
      } else { // Step toward destination
        complete = false
        let objectFinder = new WorldObjectFinder(target, context.character, context.world)
        let direction = objectFinder.findDirection()
        if (!direction.equals(Direction.here)) {
          action = new StepAction(direction)
        }
      }
    }

    return {
      step: step,
      complete: complete,
      goto: null,
      action: action,
    }
  }

  onInvalidNumberOfParams(config) {
    throw new InvalidNumberOfParamsException('\'step\' function requires one or several direction params or a variable identifier', this, {
      template: 'exception_invalid_params_one_more_dir_variable_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        },
        allowedDirections: Direction.names.filter(dir => dir !== 'here'),
        allowedVariables: config.getAllowedVariableIdentifiers(),
      }
    })
  }

  onInvalidParam(index, param, config) {
    throw new InvalidFunctionParamsException(`'${param.code.join(' ').trim()}' is not a valid DirectionLiteral or VariableIdentifier`, param, {
      template: 'exception_invalid_dir_variable_param_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        },
        param: param.code.join(' ').trim(),
        allowedDirections: Direction.names.filter(dir => dir !== 'here'),
        allowedVariables: config.getAllowedVariableIdentifiers(),
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

StepFunction.keyword = 'step'