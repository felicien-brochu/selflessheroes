import Expression from './Expression'
import SimpleBooleanExpression from './SimpleBooleanExpression'
import ExpressionTypes from './ExpressionTypes'
import ExpressionValue from './ExpressionValue'
import {
  InvalidBooleanExpressionException
} from '../CompilerException'
import {
  NotDecompilableStatementException
} from '../DecompilerException'

import {
  splitCode
} from '../utils'

const andOperator = '&&'
const orOperator = '||'

export const boolOperators = [
  andOperator,
  orOperator
]

const indentStr = '  '

export default class BooleanExpression extends Expression {
  constructor(parent, line, column) {
    super('BooleanExpression', parent, line, column)

    this.expressions = []
    this.operators = []
  }

  compile(config, context) {
    let joinedCode = this.code.join(' ')
    let remainingCode = {
      line: this.line,
      column: this.column,
      code: this.code
    }

    while (remainingCode) {
      let operator = null
      let andPosition = joinedCode.indexOf(andOperator)
      let orPosition = joinedCode.indexOf(orOperator)
      let operatorPosition = null
      if (andPosition >= 0 && (orPosition < 0 || (orPosition >= 0 && andPosition < orPosition))) {
        operator = andOperator
        operatorPosition = andPosition
      } else if (orPosition >= 0) {
        operator = orOperator
        operatorPosition = orPosition
      }

      let code
      if (operator) {
        let codeSplit = splitCode(remainingCode.code, operator, remainingCode.line, remainingCode.column)
        code = codeSplit[0]
        remainingCode = codeSplit[1]
        joinedCode = joinedCode.substring(operatorPosition + operator.length)
        this.operators.push(operator)
      } else {
        code = remainingCode
        remainingCode = null
      }

      let expression = new SimpleBooleanExpression(this, code.line, code.column)
      expression.pushLines(code.code)
      this.expressions.push(expression)
    }

    for (let expression of this.expressions) {
      expression.compile(config, context)
    }
  }

  decompile(indent, line, column) {
    super.decompile(indent, line, column)

    let executable = true

    if (this.expressions.length === 0) {
      throw new NotDecompilableStatementException('this BooleanExpression has no expression', this)
    }

    this.code = []
    for (let i = 0; i < this.expressions.length && i - 1 < this.operators.length; i++) {
      let expression = this.expressions[i]
      let column = i === 0 ? this.column : indent + indentStr.length
      executable &= expression.decompile(indent, line, column)

      let line = i > 0 ? indentStr : ''
      line += expression.code[0]

      if (i < this.operators.length) {
        line += ` ${this.operators[i]}`
      }

      this.code.push(line)
    }

    return executable
  }

  computeValue(context) {
    let values = this.expressions.map(expr => expr.computeValue(context))
    let operators = this.operators.slice(0)
    let andPosition
    while ((andPosition = operators.indexOf(andOperator)) >= 0) {
      let value = values[andPosition] && values[andPosition + 1]
      values.splice(andPosition, 2, value)
      operators.splice(andPosition, 1)
    }

    let value = values.reduce((accumulator, val) => accumulator || val)
    return ExpressionValue.boolean(value)
  }
}