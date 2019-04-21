import IfStatement from './statements/IfStatement'
import JumpStatement from './statements/JumpStatement'
import AnchorStatement from './statements/AnchorStatement'

export default class Linter {
  static removeEmptyElse(statements) {
    let changed = false
    for (let i = 0; i < statements.length; i++) {
      let statement = statements[i]
      if (statement instanceof IfStatement && statement.elseStatement && statements.indexOf(statement.elseStatement) === statements.indexOf(statement.endIfStatement) - 1) {
        statements.splice(statements.indexOf(statement.elseStatement), 1)
        statement.elseStatement = null
        changed = true
      }
    }
    return changed
  }

  static removeOrphanJumps(statements) {
    let changed = false
    for (let i = 0; i < statements.length; i++) {
      let statement = statements[i]
      if (statement instanceof JumpStatement && statements.indexOf(statement.anchorStatement) < 0) {
        statements.splice(i, 1)
        i--
        changed = true
      }
    }
    return changed
  }

  static removeOrphanAnchors(statements) {
    let changed = false
    for (let i = 0; i < statements.length; i++) {
      let statement = statements[i]
      if (statement instanceof AnchorStatement && !statements.some(s => s.anchorStatement === statement)) {
        statements.splice(i, 1)
        i--
        changed = true
      }
    }
    return changed
  }

  static correctForGraph(statements) {
    let changed = false
    changed |= Linter.jumpToUniqueAnchor(statements)
    changed |= Linter.removeOrphanAnchors(statements)
    return !!changed
  }

  static jumpToUniqueAnchor(statements) {
    let changed = false
    let jumps = statements.filter(statement => statement instanceof JumpStatement)

    for (let jump of jumps) {
      if (jumps.some(j => j !== jump && j.anchorStatement === jump.anchorStatement)) {
        let anchor = new AnchorStatement(-1, -1)
        anchor.name = AnchorStatement.getAvailableName(statements)
        statements.splice(statements.indexOf(jump.anchorStatement) + 1, 0, anchor)
        jump.setAnchorStatement(anchor)
        changed = true
      }
    }
    return changed
  }
}