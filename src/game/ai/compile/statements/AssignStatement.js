import PrimaryStatement from './PrimaryStatement'
import {
  MismatchStatementException,
  InvalidVariableIdentifierException
} from '../exceptions/CompilerException'
import {
  indexOfStringInLines,
  createUnitExpression
} from '../utils'

import VariableIdentifier from './VariableIdentifier'
import ValueFunction from './ValueFunction'
import IntegerLiteral from './IntegerLiteral'
import InvalidExpression from './InvalidExpression'

const startLineRegExp = /^\s*(\w+)\s*=\s*(.+)\s*$/
const codeRegExp = /^\s*(\w+)\s*=\s*(.+)\s*$/
const assignOperator = '='

export default class AssignStatement extends PrimaryStatement {
  constructor(line, column = 0) {
    super('AssignStatement', line, column)

    this.variable = null
  }

  static matchLine(line) {
    return startLineRegExp.test(line)
  }

  isCodeComplete() {
    return codeRegExp.test(this.code.join(' '))
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(codeRegExp)
    if (!res) {
      throw new MismatchStatementException('You try to compile as an assign statement a statement which is not one', this)
    }

    let operatorPosition = indexOfStringInLines(assignOperator, this.code)
    operatorPosition = operatorPosition[0]
    this.composite = false

    let variableCode = this.code.slice(0, operatorPosition.start.line + 1)
    let valueCode = this.code.slice(operatorPosition.start.line)

    variableCode[variableCode.length - 1] = variableCode[variableCode.length - 1].substring(0, operatorPosition.start.column)
    valueCode[0] = valueCode[0].substring(operatorPosition.end.column)

    this.variable = createUnitExpression(variableCode, [VariableIdentifier], this.line, this.column)

    if (this.variable.type === 'InvalidExpression') {
      throw new InvalidVariableIdentifierException('This identifier is not a valid variable identifier', this.variable)
    }

    this.variable.compile(config)

    this.value = createUnitExpression(valueCode, [ValueFunction, IntegerLiteral, VariableIdentifier],
      this.line + operatorPosition.end.line, operatorPosition.end.column)

    if (this.value.type === 'InvalidExpression') {
      throw new InvalidExpressionException('This identifier is neither a value function, an integer literal or a valid variable identifier', this.value)
    }
    this.value.compile(config)
  }
}