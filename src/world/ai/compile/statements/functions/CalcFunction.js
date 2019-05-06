import ValueFunction from './ValueFunction'
import ExpressionValue from '../ExpressionValue'
import ExpressionTypes from '../ExpressionTypes'
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
import Direction from '../../../../Direction'
import {
  MismatchStatementException,
  InvalidNumberOfParamsException,
  InvalidFunctionParamsException
} from '../../CompilerException'
import {
  createUnitExpression,
  extractParams
} from '../../utils'

export default class CalcFunction extends ValueFunction {
  constructor(parent, line, column) {
    super('CalcFunction', parent, line, column)
  }

  getParamTypes() {
    return [
      [{
        type: IntegerLiteral
      }, {
        type: VariableIdentifier
      }],
      [{
        type: ArithmeticOperatorLiteral
      }],
      [{
        type: IntegerLiteral
      }, {
        type: VariableIdentifier
      }]
    ]
  }

  compile(config, context) {
    super.compile(config, context)

    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(CalcFunction.correctCodeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a calc function a statement which is not one', this, {
        template: 'exception_mismatch_function_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          }
        }
      })
    }

    let paramsJoinedCode = res[2]
    let params = extractParams(paramsJoinedCode, this.code, this.line, this.column)

    if (params.length !== 3) {
      throw new InvalidNumberOfParamsException('\'calc\' function requires exactly 3 parameters', this, {
        template: 'exception_invalid_params_calc_function_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          }
        }
      })
    }
    this.params = []
    params.forEach((param, index) => this.compileParam(param, index, config, context))
  }

  compileParam(paramCode, index, config, context) {
    let param
    if (index === 1) {
      param = createUnitExpression(paramCode.code, [ArithmeticOperatorLiteral], this, paramCode.line, paramCode.column)
    } else {
      param = createUnitExpression(paramCode.code, [IntegerLiteral, VariableIdentifier], this, paramCode.line, paramCode.column)
    }
    this.params.push(param)

    if (param.type === 'InvalidExpression') {
      throw new InvalidFunctionParamsException('\'calc\' function requires exactly 3 parameters', param, {
        template: 'exception_invalid_params_calc_function_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          }
        }
      })
    }
    param.compile(config, context)
  }

  computeValue(context) {
    let leftValue = this.params[0].computeValue(context)
    let rightValue = this.params[2].computeValue(context)
    let operator = this.params[1].computeValue(context)
    let value1 = 0
    let value2 = 0

    if (leftValue.hasIntegerValue()) {
      value1 = leftValue.getFirstIntegerValue()
    }
    if (rightValue.hasIntegerValue()) {
      value2 = rightValue.getFirstIntegerValue()
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

    return ExpressionValue.integer(value)
  }
}

CalcFunction.keyword = 'calc'
CalcFunction.correctCodeRegExp = /^\s*(calc\s*\((.*)\))\s*$/
CalcFunction.codeRegExp = /^\s*(calc\s*\((.*)\)).*$/