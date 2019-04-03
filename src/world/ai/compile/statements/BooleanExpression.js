import Expression from './Expression'
import ObjectTypeLiteral from './literals/ObjectTypeLiteral'
import TerrainTypeLiteral from './literals/TerrainTypeLiteral'
import IntegerLiteral from './literals/IntegerLiteral'
import ValueFunctions from './functions/ValueFunctions'
import VariableIdentifier from './VariableIdentifier'
import InvalidExpression from './InvalidExpression'
import ExpressionTypes from './ExpressionTypes'
import ExpressionValue from './ExpressionValue'
import {
  InvalidBooleanExpressionException
} from '../CompilerException'

import {
  indexOfStringInLines,
  createUnitExpression,
  splitCode
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
  neOperator,
  eqOperator,
  leOperator,
  ltOperator,
  geOperator,
  gtOperator
]

const unitExpressions = [
  ObjectTypeLiteral,
  TerrainTypeLiteral,
  IntegerLiteral,
  VariableIdentifier,
  ...Object.values(ValueFunctions)
]


export default class BooleanExpression extends Expression {
  constructor(parent, line, column) {
    super('BooleanExpression', parent, line, column)

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
    let joinedCode = this.code.join(' ')

    for (let operator of boolOperators) {
      if (joinedCode.indexOf(operator) >= 0) {
        this.operator = operator
        break
      }
    }

    if (!this.operator) {
      return false
    }

    let codeSplit = splitCode(this.code, this.operator, this.line, this.column)

    this.composite = true
    this.expression1 = new BooleanExpression(this, codeSplit[0].line, codeSplit[0].column)
    this.expression2 = new BooleanExpression(this, codeSplit[1].line, codeSplit[1].column)
    this.expression1.pushLines(codeSplit[0].code)
    this.expression2.pushLines(codeSplit[1].code)

    return true
  }

  compileSimple(config) {
    this.operator = null
    let joinedCode = this.code.join(' ')

    for (let operator of compOperators) {
      if (joinedCode.indexOf(operator) >= 0) {
        this.operator = operator
        break
      }
    }

    if (!this.operator) {
      throw new InvalidBooleanExpressionException('no comparison operator found in this boolean expression', this)
    }

    this.composite = false

    let codeSplit = splitCode(this.code, this.operator, this.line, this.column)
    this.expression1 = createUnitExpression(codeSplit[0].code, unitExpressions, this, codeSplit[0].line, codeSplit[0].column)
    this.expression2 = createUnitExpression(codeSplit[1].code, unitExpressions, this, codeSplit[1].line, codeSplit[1].column)
  }

  computeValue(context) {
    if (this.composite) {
      return this.computeCompositeValue(context)
    } else {
      return this.computeSingleValue(context)
    }
  }

  computeCompositeValue(context) {
    let value1 = this.expression1.computeValue(context)
    let value2 = this.expression2.computeValue(context)
    let value
    if (this.operator === andOperator) {
      value = value1.value && value2.value
    } else {
      value = value1.value || value2.value
    }

    return ExpressionValue.boolean(value)
  }

  computeSingleValue(context) {
    let value1 = this.expression1.computeValue(context)
    let value2 = this.expression2.computeValue(context)
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