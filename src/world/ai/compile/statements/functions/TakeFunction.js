import FunctionExpression from './FunctionExpression'
import DirectionLiteral from '../literals/DirectionLiteral'
import VariableIdentifier from '../VariableIdentifier'
import WorldObjectFinder from '../../../WorldObjectFinder'
import Direction from '../../../../Direction'
import StepAction from '../../../../actions/StepAction'
import WaitAction from '../../../../actions/WaitAction'
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
      }, {
        type: VariableIdentifier,
      }]
    ]
  }

  computeValue(context) {
    if (this.params[0] instanceof DirectionLiteral) {
      return this.takeFromDirection(context)
    } else if (this.params[0] instanceof VariableIdentifier) {
      return this.takeFromVariable(context)
    }
  }

  takeFromDirection(context) {
    return {
      step: true,
      complete: true,
      goto: null,
      action: new TakeAction(this.params[0].value)
    }
  }

  takeFromVariable(context) {
    let complete = true
    let action = new WaitAction()

    let variable = this.params[0].computeValue(context)
    let objectValue = variable.getFirstObjectValue()

    if (!!objectValue) {
      let target = objectValue.value

      // If we arrived at destination we take
      if (WorldObjectFinder.hasArrivedAroundObject(context.character, target)) {
        action = new TakeAction(new Direction(target.x - context.character.x, target.y - context.character.y))
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
      step: true,
      complete: complete,
      goto: null,
      action: action,
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