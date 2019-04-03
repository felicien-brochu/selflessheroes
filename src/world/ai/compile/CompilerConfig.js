import EmptyStatement from './statements/EmptyStatement'
import AssignStatement from './statements/AssignStatement'
import IfStatement from './statements/IfStatement'
import ElseStatement from './statements/ElseStatement'
import EndIfStatement from './statements/EndIfStatement'
import JumpStatement from './statements/JumpStatement'
import AnchorStatement from './statements/AnchorStatement'
import DirFunction from './statements/functions/DirFunction'
import StepFunction from './statements/functions/StepFunction'
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

    config.assignValueFunctions = [
      DirFunction
    ]

    config.comparisonValueFunctions = [
      DirFunction
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

  getValueFunctionsForParent(parent) {
    if (parent instanceof AssignStatement) {
      return this.assignValueFunctions
    } else if (parent instanceof BooleanExpression) {
      return this.comparisonValueFunctions
    } else {
      return []
    }
  }
}