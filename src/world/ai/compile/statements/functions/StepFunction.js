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
    super('StepFunction', parent, 'step', line, column)
  }

  getParamTypes() {
    return [
      [{
        type: DirectionLiteral,
        multiple: true
      }]
    ]
  }

  compile(config) {
    super.compile(config)

    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(StepFunction.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a step function a statement which is not one', this)
    }

    let paramsJoinedCode = res[2]
    let params = extractParams(paramsJoinedCode, this.code, this.line, this.column)

    if (params.length < 1) {
      throw new InvalidNumberOfParamsException('\'step\' function requires at least 1 parameter', this)
    }

    this.params = []
    params.forEach((param, index) => this.compileParam(param, index, config))
  }

  compileParam(paramCode, index, config) {
    let param = createUnitExpression(paramCode.code, [DirectionLiteral], this, paramCode.line, paramCode.column)
    this.params.push(param)

    if (param.type === 'InvalidExpression') {
      throw new InvalidFunctionParamsException(`'${param.code.join(' ').trim()}' is not a valid direction literal`, param)
    }

    param.compile(config)

    if (this.params.some((p, index) => index < this.params.length - 1 && p.name === param.name)) {
      throw new InvalidFunctionParamsException(`you cannot pass the same parameter twice`, param)
    }
  }

  execute(context) {
    let r = Math.random()
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

StepFunction.startLineRegExp = /^\s*(step\s*\((.*)\))\s*/
StepFunction.codeRegExp = /^\s*(step\s*\((.*)\))\s*$/
StepFunction.paramType = {
  multiple: true,
  type: ExpressionTypes.direction
}