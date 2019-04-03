import ValueFunction from './ValueFunction'
import ExpressionValue from '../ExpressionValue'
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
    super('DirFunction', parent, 'dir', line, column)
  }

  compile(config) {
    super.compile(config)

    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(DirFunction.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a dir function a statement which is not one', this)
    }

    let paramsJoinedCode = res[2]
    let params = extractParams(paramsJoinedCode, this.code, this.line, this.column)

    if (params.length !== 1) {
      throw new InvalidNumberOfParamsException('\'dir\' function requires exactly 1 direction parameter', this)
    }
    params.forEach((param, index) => this.compileParam(param, index, config))
  }

  compileParam(paramCode, index, config) {
    let param = createUnitExpression(paramCode.code, [DirectionLiteral], this, paramCode.line, paramCode.column)
    this.params.push(param)

    if (param.type === 'InvalidExpression') {
      throw new InvalidFunctionParamsException(`\'dir\' function requires exactly 1 direction parameter`, param)
    }
    param.compile(config)
  }

  computeValue(context) {
    let res = []
    let direction = this.params[0].computeValue(context).value
    let x = context.character.x + direction.dx
    let y = context.character.y + direction.dy

    let terrainType = context.world.map.getTerrainTypeAt(x, y)
    res.push(ExpressionValue.terrainType(terrainType))

    let worldObjects = context.world.getWorldObjectsAt(x, y)
    worldObjects.forEach(obj => res.push(ExpressionValue.objectType(obj.getObjectType())))

    return ExpressionValue.composite(res)
  }
}

DirFunction.codeRegExp = /^\s*(dir\s*\((.*)\))\s*$/