import EmptyStatement from './statements/EmptyStatement'
import AssignStatement from './statements/AssignStatement'
import IfStatement from './statements/IfStatement'
import ElseStatement from './statements/ElseStatement'
import EndIfStatement from './statements/EndIfStatement'
import JumpStatement from './statements/JumpStatement'
import AnchorStatement from './statements/AnchorStatement'
import ActionFunctions from './statements/functions/ActionFunctions'
import ObjectType from '../../ObjectType'
import TerrainType from '../../TerrainType'


export default class CompilerConfig {
  constructor() {
    this.statements = []
    this.expressions = []
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
      'dir'
    ]

    config.actionFunctions = [
      'step'
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
    return this.statements.concat(this.actionFunctions.map(key => ActionFunctions[key]))
  }
}