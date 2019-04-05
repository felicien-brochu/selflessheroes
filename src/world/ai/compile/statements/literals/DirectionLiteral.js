import Expression from '../Expression'
import ExpressionValue from '../ExpressionValue'
import {
  MismatchStatementException,
  ForbiddenObjectTypeLiteralException
} from '../../CompilerException'
import Direction from '../../../../Direction'

export default class DirectionLiteral extends Expression {
  constructor(parent, line, column) {
    super('DirectionLiteral', parent, line, column)
    this.name = null
    this.value = null
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(DirectionLiteral.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a type literal a statement which is not one', this)
    }

    this.name = joinedCode.trim()
    this.value = Direction[this.name]
  }

  static isValid(code) {
    let name = code.trim()
    return !!name.match(DirectionLiteral.codeRegExp) && !!Direction[name]
  }

  computeValue(context) {
    let res = []
    let direction = this.value
    let x = context.character.x + direction.dx
    let y = context.character.y + direction.dy

    let terrainType = context.world.map.getTerrainTypeAt(x, y)
    res.push(ExpressionValue.terrainType(terrainType))

    let worldObjects = context.world.getWorldObjectsAt(x, y)
    worldObjects.forEach(obj => res.push(ExpressionValue.objectType(obj.getObjectType())))

    return ExpressionValue.composite(res)
  }
}

DirectionLiteral.codeRegExp = /^\s*(\w+)\s*$/