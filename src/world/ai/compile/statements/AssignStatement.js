import PrimaryStatement from './PrimaryStatement'
import {
  MismatchStatementException,
  InvalidVariableIdentifierException,
  InvalidExpressionException
} from '../CompilerException'
import {
  indexOfStringInLines,
  createUnitExpression
} from '../utils'

import VariableIdentifier from './VariableIdentifier'
import ValueFunctions from './functions/ValueFunctions'
import IntegerLiteral from './literals/IntegerLiteral'
import DirectionLiteral from './literals/DirectionLiteral'
import InvalidExpression from './InvalidExpression'

const assignOperator = '='

export default class AssignStatement extends PrimaryStatement {
  constructor(parent, line, column = 0) {
    super('AssignStatement', line, column)

    this.variable = null
    this.value = null
  }

  isCodeComplete() {
    return AssignStatement.codeRegExp.test(this.code.join(' '))
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(AssignStatement.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as an assign statement a statement which is not one', this)
    }

    let operatorPosition = indexOfStringInLines(assignOperator, this.code)
    operatorPosition = operatorPosition[0]
    this.composite = false

    let variableCode = this.code.slice(0, operatorPosition.start.line + 1)
    let valueCode = this.code.slice(operatorPosition.start.line)

    variableCode[variableCode.length - 1] = variableCode[variableCode.length - 1].substring(0, operatorPosition.start.column)
    valueCode[0] = valueCode[0].substring(operatorPosition.end.column)

    this.variable = createUnitExpression(variableCode, [VariableIdentifier], this, this.line, this.column)

    if (this.variable.type === 'InvalidExpression') {
      throw new InvalidVariableIdentifierException('this identifier is not a valid variable identifier', this.variable)
    }

    this.variable.compile(config)

    this.value = createUnitExpression(valueCode, [IntegerLiteral, DirectionLiteral, VariableIdentifier, ...Object.values(ValueFunctions)],
      this, this.line + operatorPosition.end.line, operatorPosition.end.column)

    if (this.value.type === 'InvalidExpression') {
      throw new InvalidExpressionException('this identifier is neither a value function, an integer literal or a valid variable identifier', this.value)
    }
    this.value.compile(config)
  }

  execute(context) {
    context.variables[this.variable.name] = this.value.computeValue(context)
    return {
      step: true,
      complete: true,
      goto: null,
      action: null
    }
  }
}

AssignStatement.startLineRegExp = /^\s*(\w+)\s*=\s*(.+)\s*$/
AssignStatement.codeRegExp = /^\s*(\w+)\s*=\s*(.+)\s*$/