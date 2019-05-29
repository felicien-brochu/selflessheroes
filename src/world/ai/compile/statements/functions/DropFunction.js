import ActionFunction from './ActionFunction'
import DirectionLiteral from '../literals/DirectionLiteral'
import ExpressionTypes from '../ExpressionTypes'
import Direction from '../../../../Direction'
import DropAction from '../../../../actions/DropAction'
import {
  MismatchStatementException,
  InvalidNumberOfParamsException,
  InvalidFunctionParamsException
} from '../../CompilerException'
import {
  createUnitExpression,
  extractParams
} from '../../utils'

export default class DropFunction extends ActionFunction {
  constructor(parent, line, column) {
    super('DropFunction', parent, line, column)
  }

  getParamTypes() {
    return [
      [{
        type: DirectionLiteral,
        multiple: false,
        notHere: false
      }]
    ]
  }

  compile(config, context) {
    super.compile(config, context)

    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(DropFunction.correctCodeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a drop function a statement which is not one', this, {
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
      throw new InvalidNumberOfParamsException('\'drop\' function requires exactly 1 direction parameter', this, {
        template: 'exception_invalid_params_one_dir_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          },
          directions: Direction.names
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
      throw new InvalidFunctionParamsException(`'${param.code.join(' ').trim()}' is not a valid direction literal`, param, {
        template: 'exception_invalid_direction_param_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          },
          param: param.code.join(' ').trim(),
          allowedValues: Direction.names
        }
      })
    }

    param.compile(config, context)
  }

  execute(context) {
    return {
      step: true,
      complete: true,
      goto: null,
      action: new DropAction(this.params[0].value)
    }
  }
}

DropFunction.keyword = 'drop'
DropFunction.startLineRegExp = /^\s*(drop\s*\((.*)\))\s*/
DropFunction.correctCodeRegExp = /^\s*(drop\s*\((.*)\))\s*$/
DropFunction.codeRegExp = /^\s*(drop\s*\((.*)\)).*$/