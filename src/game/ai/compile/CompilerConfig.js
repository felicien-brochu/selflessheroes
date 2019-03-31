import EmptyStatement from './statements/EmptyStatement'
import AssignStatement from './statements/AssignStatement'
import IfStatement from './statements/IfStatement'
import ElseStatement from './statements/ElseStatement'
import EndIfStatement from './statements/EndIfStatement'
import ActionFunction from './statements/ActionFunction'
import JumpStatement from './statements/JumpStatement'
import AnchorStatement from './statements/AnchorStatement'
import {
  typeEmpty,
  typeWall,
  typeHole,
  typeHero
} from './statements/ObjectTypeLiteral'


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
      ActionFunction,
      JumpStatement,
      AnchorStatement
    ]

    config.variables = 3

    config.objectTypes = [
      typeEmpty,
      typeWall,
      typeHole,
      typeHero
    ]

    config.valueFunctions = [
      'dir'
    ]

    config.actions = [
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
}