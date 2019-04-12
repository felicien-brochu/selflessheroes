import EmptyStatement from './statements/EmptyStatement'
import AssignStatement from './statements/AssignStatement'
import IfStatement from './statements/IfStatement'
import ElseStatement from './statements/ElseStatement'
import EndIfStatement from './statements/EndIfStatement'
import JumpStatement from './statements/JumpStatement'
import AnchorStatement from './statements/AnchorStatement'
import BooleanExpression from './statements/BooleanExpression'
import DirFunction from './statements/functions/DirFunction'
import StepFunction from './statements/functions/StepFunction'
import VariableIdentifier from './statements/VariableIdentifier'
import ObjectTypeLiteral from './statements/literals/ObjectTypeLiteral'
import TerrainTypeLiteral from './statements/literals/TerrainTypeLiteral'
import DirectionLiteral from './statements/literals/DirectionLiteral'
import IntegerLiteral from './statements/literals/IntegerLiteral'
import ObjectType from '../../ObjectType'
import TerrainType from '../../TerrainType'

export default class CompilerConfig {
  constructor() {
    this.statements = []
  }

  static getDefaultConfig() {
    let config = new CompilerConfig()
    config.statements = [
      EmptyStatement,
      AssignStatement,
      IfStatement,
      ElseStatement,
      EndIfStatement,
      JumpStatement,
      AnchorStatement
    ]

    config.variables = 3

    config.objectTypes = Object.keys(ObjectType)
    config.terrainTypes = Object.keys(TerrainType)

    config.valueFunctions = [
      DirFunction
    ]

    config.leftComparisonExpressions = [
      DirectionLiteral,
      VariableIdentifier,
    ]
    config.rightComparisonExpressions = [
      DirectionLiteral,
      ObjectTypeLiteral,
      TerrainTypeLiteral,
      IntegerLiteral,
      VariableIdentifier,
    ]

    config.actionFunctions = [
      StepFunction
    ]

    return config
  }

  getAllowedVariableIdentifiers() {
    let names = []
    for (let i = 0; i < this.variables; i++) {
      names.push(String.fromCharCode(0x61 + i))
    }
    return names
  }

  getPrimaryStatements() {
    return this.statements.concat(this.actionFunctions)
  }
}