import PrimaryStatement from './PrimaryStatement'
import ActionFunctions from './functions/ActionFunctions'
import {
  MismatchStatementException,
  ForbiddenActionFunctionException,
  UnknownFunctionException,
  InvalidFunctionParamsException,
  InvalidExpressionException
} from '../CompilerException'
import {
  createUnitExpression
} from '../utils'


class ActionStatement extends PrimaryStatement {
  constructor(line, column) {
    super('ActionStatement', line, column)
    this.function = null
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  compile(config, context) {
    const joinedCode = this.code.join(' ')
    this.function = createUnitExpression(this.code, config.actionFunctions,
      this, this.line, this.column)

    if (this.function.type === 'InvalidExpression') {
      throw new InvalidExpressionException('this identifier is not an action function', this.function, {
        template: 'exception_invalid_action_function_template',
        values: {
          code: this.function.code.join(' ').trim(),
          allowedFunctions: config.actionFunctions.map(f => `${f.keyword}()`)
        }
      })
    }
    this.function.compile(config, context)
  }

  decompile(indent, line, column) {
    super.decompile(line, column)

    if (!this.function) {
      throw new NotDecompilableStatementException('this action statement has no associated function', this)
    }

    this.function.decompile(indent, line, column)
    this.code = this.function.code.slice()
    this.indentCode(indent)

    return true
  }

  execute(context) {
    return this.function.computeValue(context)
  }

  getStepPriority() {
    return this.function.getStepPriority()
  }
}

ActionStatement.startLineRegExp = /^\s*((\w+)\s*\((.*)\))/

export default ActionStatement