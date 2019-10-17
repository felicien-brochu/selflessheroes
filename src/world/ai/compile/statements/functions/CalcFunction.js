import FunctionExpression from './FunctionExpression'
import ExpressionValue from '../ExpressionValue'
import VariableIdentifier from '../VariableIdentifier'
import ArithmeticOperatorLiteral from '../literals/ArithmeticOperatorLiteral'
import {
  addOperator,
  substractOperator,
  multiplyOperator,
  divideOperator,
  moduloOperator
} from '../literals/ArithmeticOperatorLiteral'
import IntegerLiteral from '../literals/IntegerLiteral'
import MyItemLiteral from '../literals/MyItemLiteral'
import DirectionLiteral from '../literals/DirectionLiteral'
import {
  InvalidNumberOfParamsException,
  InvalidFunctionParamsException
} from '../../CompilerException'

export default class CalcFunction extends FunctionExpression {
  constructor(parent, line, column) {
    super('CalcFunction', parent, line, column)
  }

  getParamTypes() {
    return [
      [{
        type: MyItemLiteral
      }, {
        type: IntegerLiteral
      }, {
        type: DirectionLiteral
      }, {
        type: VariableIdentifier
      }],
      [{
        type: ArithmeticOperatorLiteral
      }],
      [{
        type: MyItemLiteral
      }, {
        type: IntegerLiteral
      }, {
        type: DirectionLiteral
      }, {
        type: VariableIdentifier
      }]
    ]
  }

  computeValue(context) {
    let leftValue = this.params[0].computeValue(context)
    let rightValue = this.params[2].computeValue(context)
    let operator = this.params[1].computeValue(context)
    let value1 = 0
    let value2 = 0

    if (leftValue.hasIntegerValue()) {
      value1 = leftValue.getFirstIntegerValue().value
    }
    if (rightValue.hasIntegerValue()) {
      value2 = rightValue.getFirstIntegerValue().value
    }

    let value = 0
    switch (operator) {
      case addOperator:
        value = value1 + value2
        break
      case substractOperator:
        value = value1 - value2
        break
      case multiplyOperator:
        value = value1 * value2
        break
      case divideOperator:
        value = Math.floor(value1 / value2)
        break
      case moduloOperator:
        value = value1 % value2
        break
    }

    context.calculation.type = 'calc'
    context.calculation.operands.push({
      type: 'value',
      value: leftValue,
    }, {
      type: 'operator',
      value: operator,
    }, {
      type: 'value',
      value: rightValue,
    })

    return ExpressionValue.integer(value)
  }

  onInvalidNumberOfParams(config) {
    throw new InvalidNumberOfParamsException('\'calc\' function requires exactly 3 parameters', this, {
      template: 'exception_invalid_params_calc_function_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        },
        operators: [
          addOperator,
          substractOperator,
          multiplyOperator,
          moduloOperator,
          divideOperator
        ]
      }
    })
  }

  onInvalidParam(index, param, config) {
    throw new InvalidFunctionParamsException('\'calc\' function requires exactly 3 parameters', param, {
      template: 'exception_invalid_params_calc_function_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        },
        operators: [
          addOperator,
          substractOperator,
          multiplyOperator,
          moduloOperator,
          divideOperator
        ]
      }
    })
  }
}

CalcFunction.keyword = 'calc'