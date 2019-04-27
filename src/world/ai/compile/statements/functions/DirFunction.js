import ValueFunction from './ValueFunction'
import ExpressionValue from '../ExpressionValue'
import ExpressionTypes from '../ExpressionTypes'
import DirectionLiteral from '../literals/DirectionLiteral'
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

export default class DirFunction extends ValueFunction {
  constructor(parent, line, column) {
    super('DirFunction', parent, line, column)
  }

  getParamTypes() {
    return [
      [{
        type: DirectionLiteral,
        multiple: false
      }]
    ]
  }

  compile(config, context) {
    super.compile(config, context)

    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(DirFunction.correctCodeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a dir function a statement which is not one', this, {
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

    if (params.length !== 1) {
      throw new InvalidNumberOfParamsException('\'dir\' function requires exactly 1 direction parameter', this, {
        template: 'exception_invalid_params_one_dir_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          },
          directions: Direction.names.slice(0)
        }
      })
    }
    this.params = []
    params.forEach((param, index) => this.compileParam(param, index, config, context))
  }

  compileParam(paramCode, index, config, context) {
    let param = createUnitExpression(paramCode.code, [DirectionLiteral], this, paramCode.line, paramCode.column)
    this.params.push(param)

    if (param.type === 'InvalidExpression') {
      throw new InvalidFunctionParamsException(`\'dir\' function requires exactly 1 direction parameter`, param, {
        template: 'exception_invalid_direction_param_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          },
          param: param.code.join(' ').trim(),
          allowedValues: Direction.names.slice(0)
        }
      })
    }
    param.compile(config, context)
  }

  computeValue(context) {
    return this.params[0].computeValue(context)
  }
}

DirFunction.keyword = 'dir'
DirFunction.correctCodeRegExp = /^\s*(dir\s*\((.*)\))\s*$/
DirFunction.codeRegExp = /^\s*(dir\s*\((.*)\)).*$/