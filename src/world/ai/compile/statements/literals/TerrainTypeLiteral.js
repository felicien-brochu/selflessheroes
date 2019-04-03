import Expression from '../Expression'
import ExpressionValue from '../ExpressionValue'
import {
  MismatchStatementException,
  ForbiddenObjectTypeLiteralException
} from '../../CompilerException'
import TerrainType from '../../../../TerrainType'

export default class TerrainTypeLiteral extends Expression {
  constructor(parent, line, column) {
    super('TerrainTypeLiteral', parent, line, column)
    this.name = null
    this.value = null
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(TerrainTypeLiteral.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a type literal a statement which is not one', this)
    }

    this.name = joinedCode.trim()

    if (!config.terrainTypes.some(type => this.name === type)) {
      throw new ForbiddenTerrainTypeLiteralException(`the terrain type literal '${this.name}' is forbidden. You may use the following terrain types: ${config.terrainTypes}`, this)
    }

    this.value = TerrainType[this.name]
  }

  static isValid(code) {
    let name = code.trim()
    return !!name.match(TerrainTypeLiteral.codeRegExp) && !!TerrainType[name]
  }

  computeValue(context) {
    return ExpressionValue.terrainType(this.value)
  }
}

TerrainTypeLiteral.codeRegExp = /^\s*(\w+)\s*$/