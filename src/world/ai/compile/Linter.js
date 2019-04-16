import IfStatement from './statements/IfStatement'
import JumpStatement from './statements/JumpStatement'
import AnchorStatement from './statements/AnchorStatement'

export default class Linter {
  static removeEmptyElse(statements) {
    for (let i = 0; i < statements.length; i++) {
      let statement = statements[i]
      if (statement instanceof IfStatement && statement.elseStatement && statements.indexOf(statement.elseStatement) === statements.indexOf(statement.endIfStatement) - 1) {
        statements.splice(statements.indexOf(statement.elseStatement), 1)
        statement.elseStatement = null
      }
    }
  }

  static removeOrphanJumps(statements) {
    for (let i = 0; i < statements.length; i++) {
      let statement = statements[i]
      if (statement instanceof JumpStatement && statements.indexOf(statement.anchorStatement) < 0) {
        statements.splice(i, 1)
        i--
      }
    }
  }

  static removeOrphanAnchors(statements) {
    for (let i = 0; i < statements.length; i++) {
      let statement = statements[i]
      if (statement instanceof AnchorStatement && !statements.some(s => s.anchorStatement === statement)) {
        statements.splice(i, 1)
        i--
      }
    }
  }
}