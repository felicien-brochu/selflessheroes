import FunctionExpression from './FunctionExpression'
import ExpressionValue from '../ExpressionValue'
import MessageLiteral from '../literals/MessageLiteral'
import EveryoneLiteral from '../literals/EveryoneLiteral'
import DirectionLiteral from '../literals/DirectionLiteral'
import Direction from '../../../../Direction'
import {
  InvalidNumberOfParamsException,
  InvalidFunctionParamsException
} from '../../CompilerException'

export default class TellFunction extends FunctionExpression {
  constructor(parent, line, column) {
    super('TellFunction', parent, line, column)
  }

  getRawParamTypes() {
    return [
      [{
        type: MessageLiteral
      }],
      [{
        type: DirectionLiteral,
        multiple: false,
        validator: DirectionLiteral.notHereValidator,
      }, {
        type: EveryoneLiteral
      }]
    ]
  }

  computeValue(context) {
    let param2 = this.params[1]
    let channel = null
    if (param2 instanceof DirectionLiteral) {
      channel = param2.value
    } else if (param2 instanceof EveryoneLiteral) {
      channel = 'everyone'
    }
    context.character.tell(this.params[0].computeValue(context), channel)

    return {
      step: true,
      complete: true,
      goto: null,
      action: null
    }
  }

  onInvalidNumberOfParams(config) {
    throw new InvalidNumberOfParamsException('\'tell\' function requires exactly 2 parameters', this, {
      template: 'exception_invalid_params_tell_function_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        },
        allowedMessages: config.getAllowedMessageLiterals().map(message => `"${message}"`),
        allowedDirections: Direction.names.filter(dir => dir !== 'here'),
      }
    })
  }

  onInvalidParam(index, param, config) {
    throw new InvalidFunctionParamsException('\'tell\' function requires exactly 2 parameters', this, {
      template: 'exception_invalid_params_tell_function_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        },
        allowedMessages: config.getAllowedMessageLiterals().map(message => `"${message}"`),
        allowedDirections: Direction.names.filter(dir => dir !== 'here'),
      }
    })
  }
}

TellFunction.keyword = 'tell'
TellFunction.isSpeachType = true