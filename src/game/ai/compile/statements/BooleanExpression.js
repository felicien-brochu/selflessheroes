import Expression from './Expression'
import TypeLiteral from './TypeLiteral'
import IntegerLiteral from './IntegerLiteral'
import VariableIdentifier from './VariableIdentifier'
import ValueFunction from './ValueFunction'
import InvalidExpression from './InvalidExpression'
import {
  InvalidBooleanExpressionException
} from '../exceptions/CompilerException'

import {
  indexOfStringInLines,
  createUnitExpression
} from '../utils'

const andOperator = '&&'
const orOperator = '||'

const boolOperators = [
  orOperator,
  andOperator
]

const eqOperator = '=='
const neOperator = '!='
const ltOperator = '<'
const leOperator = '<='
const gtOperator = '>'
const geOperator = '>='

const compOperators = [
  eqOperator,
  neOperator,
  ltOperator,
  leOperator,
  gtOperator,
  geOperator
]

const unitExpressions = [
  TypeLiteral,
  IntegerLiteral,
  VariableIdentifier,
  ValueFunction
]


export default class BooleanExpression extends Expression {
  constructor(line, column) {
    super('BooleanExpression', line, column)

    this.expression1 = null
    this.expression2 = null
    this.composite = true
    this.operator = null
  }

  compile(config) {
    if (!this.compileComposite(config)) {
      this.compileSimple(config)
    }

    this.expression1.compile(config)
    this.expression2.compile(config)
  }

  compileComposite(config) {
    this.operator = null
    let operatorPosition

    for (let operator of boolOperators) {
      operatorPosition = indexOfStringInLines(operator, this.code)
      if (operatorPosition.length > 0) {
        this.operator = operator
        break
      }
    }

    if (!this.operator) {
      return false
    }

    operatorPosition = operatorPosition[0]

    this.composite = true
    this.expression1 = new BooleanExpression(this.line, this.column)
    this.expression2 = new BooleanExpression(this.line + operatorPosition.end.line, operatorPosition.end.column)

    let expression1Code = this.code.slice(0, operatorPosition.start.line + 1)
    let expression2Code = this.code.slice(operatorPosition.start.line)

    expression1Code[expression1Code.length - 1] = expression1Code[expression1Code.length - 1].substring(0, operatorPosition.start.column)
    expression2Code[0] = expression2Code[0].substring(operatorPosition.end.column)

    this.expression1.pushLines(expression1Code)
    this.expression2.pushLines(expression2Code)

    return true
  }

  compileSimple(config) {
    this.operator = null
    let operatorPosition

    for (let operator of compOperators) {
      operatorPosition = indexOfStringInLines(operator, this.code)
      if (operatorPosition.length > 0) {
        this.operator = operator
        break
      }
    }

    if (!this.operator) {
      throw new InvalidBooleanExpressionException('no comparison operator found in this boolean expression', this)
    }

    operatorPosition = operatorPosition[0]
    this.composite = false

    let expression1Code = this.code.slice(0, operatorPosition.start.line + 1)
    let expression2Code = this.code.slice(operatorPosition.start.line)

    expression1Code[expression1Code.length - 1] = expression1Code[expression1Code.length - 1].substring(0, operatorPosition.start.column)
    expression2Code[0] = expression2Code[0].substring(operatorPosition.end.column)

    this.expression1 = createUnitExpression(expression1Code, unitExpressions, this.line, this.column)
    this.expression2 = createUnitExpression(expression2Code, unitExpressions, this.line + operatorPosition.end.line, operatorPosition.end.column)
  }
}