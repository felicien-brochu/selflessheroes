import Expression from '../Expression'
import ExpressionValue from '../ExpressionValue'
import {
  MismatchStatementException,
  ForbiddenTerrainTypeLiteralException
} from '../../CompilerException'
import {
  NotDecompilableStatementException
} from '../../DecompilerException'
import TerrainType from '../../../../map/TerrainType'

export default class TerrainTypeLiteral extends Expression {
  constructor(parent, line, column) {
    super('TerrainTypeLiteral', parent, line, column)
    this.name = null
    this.value = null
  }

  compile(config, context) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(TerrainTypeLiteral.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a type literal a statement which is not one', this)
    }

    this.name = joinedCode.trim()

    if (!config.terrainTypes.some(type => this.name === type)) {
      throw new ForbiddenTerrainTypeLiteralException(`the terrain type literal '${this.name}' is forbidden. You may use the following terrain types: ${config.terrainTypes}`, this, {
        template: 'exception_forbidden_terrain_type_template',
        values: {
          keyword: this.name,
          allowedValues: config.terrainTypes.slice(0)
        }
      })
    }

    this.value = TerrainType[this.name]
  }

  decompile(indent, line, column) {
    super.decompile(indent, line, column)

    if (!this.name) {
      throw new NotDecompilableStatementException('this terrain type literal has no name', this)
    }
    this.code = [this.name]

    return true
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