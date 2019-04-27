import Expression from './Expression'
import ObjectTypeLiteral from './literals/ObjectTypeLiteral'
import TerrainTypeLiteral from './literals/TerrainTypeLiteral'
import IntegerLiteral from './literals/IntegerLiteral'
import DirectionLiteral from './literals/DirectionLiteral'
import ValueFunctions from './functions/ValueFunctions'
import VariableIdentifier from './VariableIdentifier'
import InvalidExpression from './InvalidExpression'
import ExpressionTypes from './ExpressionTypes'
import ExpressionValue from './ExpressionValue'
import {
  InvalidBooleanExpressionException
} from '../CompilerException'
import {
  NotDecompilableStatementException
} from '../DecompilerException'

import {
  indexOfStringInLines,
  createUnitExpression,
  splitCode
} from '../utils'

const eqOperator = '=='
const neOperator = '!='
const ltOperator = '<'
const leOperator = '<='
const gtOperator = '>'
const geOperator = '>='

export const compOperators = [
  eqOperator,
  neOperator,
  leOperator,
  ltOperator,
  geOperator,
  gtOperator
]


export default class SimpleBooleanExpression extends Expression {
  constructor(parent, line, column) {
    super('SimpleBooleanExpression', parent, line, column)

    this.leftExpression = null
    this.rightExpression = null
    this.operator = null
  }

  compile(config, context) {
    this.operator = null
    let joinedCode = this.code.join(' ')

    for (let operator of compOperators) {
      if (joinedCode.indexOf(operator) >= 0) {
        this.operator = operator
        break
      }
    }

    if (!this.operator) {
      throw new InvalidBooleanExpressionException('no comparison operator found in this boolean expression', this, {
        template: 'level.code.exception_boolean_no_comparison_operator_template',
        values: {
          allowedOperators: compOperators.slice(0)
        }
      })
    }

    let codeSplit = splitCode(this.code, this.operator, this.line, this.column)
    this.leftExpression = createUnitExpression(codeSplit[0].code, config.leftComparisonExpressions, this, codeSplit[0].line, codeSplit[0].column)
    this.rightExpression = createUnitExpression(codeSplit[1].code, config.rightComparisonExpressions, this, codeSplit[1].line, codeSplit[1].column)

    this.leftExpression.compile(config, context)
    this.rightExpression.compile(config, context)
  }

  decompile(indent, line, column) {
    super.decompile(indent, line, column)

    let executable = true
    let code = ''

    if (!this.operator) {
      throw new NotDecompilableStatementException('this simple boolean expression has no operator', this)
    }

    let leftExpression = this.undefinedCode
    if (this.leftExpression) {
      executable &= this.leftExpression.decompile(indent, line, this.column + code.length)
      leftExpression = this.leftExpression.code[0]
    } else {
      executable = false
    }

    code += `${leftExpression} ${this.operator} `

    let rightExpression = this.undefinedCode
    if (this.rightExpression) {
      executable &= this.rightExpression.decompile(indent, line, this.column + code.length)
      rightExpression = this.rightExpression.code[0]
    } else {
      executable = false
    }

    code += rightExpression
    this.code = [code]

    return executable
  }

  computeValue(context) {
    let value1 = this.leftExpression.computeValue(context)
    let value2 = this.rightExpression.computeValue(context)
    let value = false

    if (this.operator === eqOperator) {
      value = this.computeEqual(value1, value2)
    } else if (this.operator === neOperator) {
      value = !this.computeEqual(value1, value2)
    } else
    if (value1.hasIntegerValue() && value2.hasIntegerValue()) {
      if (this.operator === ltOperator) {
        value = value1.value < value2.value
      } else if (this.operator === leOperator) {
        value = value1.value <= value2.value
      } else if (this.operator === gtOperator) {
        value = value1.value > value2.value
      } else if (this.operator === geOperator) {
        value = value1.value >= value2.value
      }
    }

    return ExpressionValue.boolean(value)
  }

  computeEqual(value1, value2) {
    if (value1.hasBooleanValue() && value2.hasBooleanValue()) {
      return value1.getFirstBooleanValue() === value2.getFirstBooleanValue()
    } else if (value1.hasIntegerValue() && value2.hasIntegerValue()) {
      return value1.getFirstIntegerValue() === value2.getFirstIntegerValue()
    } else if (value1.hasObjectTypeValue() && value2.hasObjectTypeValue()) {
      if (value1.type === ExpressionTypes.objectType) {
        if (value2.type === ExpressionTypes.objectType) {
          return value1.value === value2.value
        } else if (value2.type === ExpressionTypes.composite) {
          return value2.value.some(val => value1.value === val.value)
        }
      } else if (value1.type === ExpressionTypes.composite) {
        if (value2.type === ExpressionTypes.objectType) {
          return value1.value.some(val => value2.value === val.value)
        } else if (value2.type === ExpressionTypes.composite) {
          return value1.value.some(val => value2.value.some(v => v.value === val.value))
        }
      }
    } else if (value1.hasTerrainTypeValue() && value2.hasTerrainTypeValue()) {
      if (value1.type === ExpressionTypes.terrainType) {
        if (value2.type === ExpressionTypes.terrainType) {
          return value1.value === value2.value
        } else if (value2.type === ExpressionTypes.composite) {
          return value2.value.some(val => value1.value === val.value)
        }
      } else if (value1.type === ExpressionTypes.composite) {
        if (value2.type === ExpressionTypes.terrainType) {
          return value1.value.some(val => value2.value === val.value)
        } else if (value2.type === ExpressionTypes.composite) {
          return value1.value.some(val => value2.value.some(v => v.value === val.value))
        }
      }
    }
    return false
  }
}