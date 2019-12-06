import Expression from '../Expression'
import ExpressionValue from '../ExpressionValue'
import {
  MismatchStatementException,
  ForbiddenMessageLiteralException,
  ForbiddenExpressionTypeException,
} from '../../CompilerException'

export const messageHey = 'hey'
export const messageLol = 'lol'
export const messageHo = 'ho'
export const messageKiss = 'kiss'
export const messageStop = 'stop'
export const messageWait = 'wait'
export const messageOK = 'ok'
export const messageCoffee = 'coffee'

export const messages = [
  messageOK,
  messageStop,
  messageWait,
  messageHey,
  messageLol,
  messageHo,
  messageKiss,
  messageCoffee,
]

export default class MessageLiteral extends Expression {
  constructor(parent, line, column) {
    super('MessageLiteral', parent, line, column)
    this.message = null
  }

  compile(config, context) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(MessageLiteral.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a message literal a statement which is not one', this)
    }

    this.message = res[1]

    if (!config.isExpressionTypeAvailable(this.constructor)) {
      throw new ForbiddenExpressionTypeException(`'${this.code.join(' ').trim()}' MessageLiteral are not available.`, this, {
        template: 'exception_forbidden_message_literal_type_template',
      })
    }

    const allowedMessages = config.getAllowedMessageLiterals()

    if (!allowedMessages.includes(this.message)) {
      const allowedMessagesString = allowedMessages.map(message => `"${message}"`)
      throw new ForbiddenMessageLiteralException(`'${this.code.join(' ').trim()}' is not a supported message: use one of these instead : ${allowedMessagesString}`, this, {
        template: 'exception_forbidden_message_literal_template',
        values: {
          message: this.message,
          allowedMessages: allowedMessagesString,
        }
      })
    }
  }

  decompile(indent, line, column) {
    super.decompile(indent, line, column)

    this.code = [`"${this.message}"`]

    return true
  }

  computeValue(context) {
    return ExpressionValue.message(this.message)
  }
}

MessageLiteral.codeRegExp = /^\s*["'](\w+)["']\s*$/