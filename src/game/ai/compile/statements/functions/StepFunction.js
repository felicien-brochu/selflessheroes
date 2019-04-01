import ActionFunction from './ActionFunction'
import DirectionLiteral from '../literals/DirectionLiteral'
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
  constructor(line, column) {
    super('StepFunction', 'step', line, column)
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

    // Check uniqueness
    let paramsCode = params.map(param => param.code.join(' ').trim())
    if (paramsCode.some(param => (paramsCode.indexOf(param) !== paramsCode.lastIndexOf(param)))) {
      throw new InvalidFunctionParamsException(`you cannot pass the same parameter twice`, this)
    }
    params.forEach((param, index) => this.compileParam(param, index, config))
  }

  compileParam(paramCode, index, config) {
    let param = createUnitExpression(paramCode.code, [DirectionLiteral], paramCode.line, paramCode.column)
    this.params.push(param)

    if (param.type === 'InvalidExpression') {
      throw new InvalidFunctionParamsException(`the function 'step()' only accept direction literals as parameter`, param)
    }
    param.compile(config)
  }

  execute(context) {
    let r = Math.random()
    let dir = Direction.here
    for (let i = 0; i < this.params.length; i++) {
      if (r < 1 * ((i + 1) / this.params.length)) {
        dir = this.params[i].computeValue(context).value
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