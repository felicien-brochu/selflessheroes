import FunctionExpression from './FunctionExpression'
import ExpressionValue from '../ExpressionValue'
import MessageLiteral from '../literals/MessageLiteral'
import {
  InvalidNumberOfParamsException,
  InvalidFunctionParamsException
} from '../../CompilerException'
import StepPriority from '../../../StepPriority'

export default class ListenFunction extends FunctionExpression {
  constructor(parent, line, column) {
    super('ListenFunction', parent, line, column)
  }

  getRawParamTypes() {
    return [
      [{
        type: MessageLiteral
      }]
    ]
  }

  computeValue(context) {
    let complete = false
    let messages = []
    let hereChannel = context.world.speachChannels.find(channel =>
      typeof channel.key === 'object' &&
      channel.key.x === context.character.x &&
      channel.key.y === context.character.y
    )
    if (hereChannel) {
      messages = messages.concat(hereChannel.messages)
    }

    let everyoneChannel = context.world.speachChannels.find(channel => channel.key === 'everyone')
    if (everyoneChannel) {
      messages = messages.concat(everyoneChannel.messages)
    }

    complete = messages.some(message => message.hasMessageValue() && message.value === this.params[0].computeValue(context).value)

    return {
      step: true,
      complete: complete,
      goto: null,
      action: null
    }
  }

  onInvalidNumberOfParams(config) {
    throw new InvalidNumberOfParamsException('\'listen\' function requires exactly 1 message parameter', this, {
      template: 'exception_invalid_params_one_message_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        },
        allowedMessages: config.getAllowedMessageLiterals().map(message => `"${message}"`),
      }
    })
  }

  onInvalidParam(index, param, config) {
    throw new InvalidFunctionParamsException('\'listen\' function requires exactly 1 message parameter', this, {
      template: 'exception_invalid_params_one_message_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        },
        allowedMessages: config.getAllowedMessageLiterals().map(message => `"${message}"`),
      }
    })
  }

  getStepPriority() {
    return StepPriority.LISTEN
  }
}

ListenFunction.keyword = 'listen'
ListenFunction.isSpeachType = true