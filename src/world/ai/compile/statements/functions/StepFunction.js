import ActionFunction from './ActionFunction'
import DirectionLiteral from '../literals/DirectionLiteral'
import ExpressionTypes from '../ExpressionTypes'
import Direction from '../../../../Direction'
import StepAction from '../../../../actions/StepAction'
import {
  MismatchStatementException,
  InvalidNumberOfParamsException,
  InvalidFunctionParamsException
} from '../../CompilerException'
import {
  createUnitExpression,
  extractParams
} from '../../utils'

const identifier = 'step'

export default class StepFunction extends ActionFunction {
  constructor(parent, line, column) {
    super('StepFunction', parent, line, column)
  }

  getParamTypes() {
    return [
      [{
        type: DirectionLiteral,
        multiple: true,
        notHere: true
      }]
    ]
  }

  compile(config, context) {
    super.compile(config, context)

    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(StepFunction.correctCodeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a step function a statement which is not one', this, {
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

    if (params.length < 1) {
      throw new InvalidNumberOfParamsException('\'step\' function requires at least 1 parameter', this, {
        template: 'exception_invalid_params_one_more_dir_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          },
          directions: Direction.names.filter(dir => dir !== 'here')
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
          allowedValues: Direction.names.filter(dir => dir !== 'here')
        }
      })
    }

    param.compile(config, context)

    if (this.params.some((p, index) => index < this.params.length - 1 && p.name === param.name)) {
      throw new InvalidFunctionParamsException(`you cannot pass the same parameter twice`, param, {
        template: 'exception_duplicate_param_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          },
          param: param.code.join(' ').trim()
        }
      })
    }
  }

  execute(context) {
    let r = context.rng()
    let dir = Direction.here
    for (let i = 0; i < this.params.length; i++) {
      if (r < 1 * ((i + 1) / this.params.length)) {
        dir = this.params[i].value
        break
      }
    }
    return {
      step: true,
      complete: true,
      goto: null,
      action: new StepAction(dir)
    }
  }
}

StepFunction.keyword = 'step'
StepFunction.startLineRegExp = /^\s*(step\s*\((.*)\))\s*/
StepFunction.correctCodeRegExp = /^\s*(step\s*\((.*)\))\s*$/
StepFunction.codeRegExp = /^\s*(step\s*\((.*)\)).*$/