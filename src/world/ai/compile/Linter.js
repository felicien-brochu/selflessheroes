import IfStatement from './statements/IfStatement'
import JumpStatement from './statements/JumpStatement'
import AnchorStatement from './statements/AnchorStatement'
import InvalidStatement from './statements/InvalidStatement'
import PrimaryStatement from './statements/PrimaryStatement'
import Compiler from './Compiler'
import Decompiler from './Decompiler'

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

  static correctForGraph(statements, compilerExceptions, compilerConfig) {
    let changed = false
    if (compilerExceptions.fatal.length > 0) {
      changed |= Linter.correctFatalExceptions(statements, compilerExceptions, compilerConfig)
    }
    changed |= Linter.removeEmptyElse(statements)
    changed |= Linter.jumpToUniqueAnchor(statements)
    changed |= Linter.removeOrphanAnchors(statements)
    return !!changed
  }

  static correctFatalExceptions(statements, compilerExceptions, compilerConfig) {
    let changed = false

    changed |= Linter.removeInvalidStatements(statements)

    let exception = null
    let toRemove = null
    while (compilerExceptions.fatal.length > 0 && statements.length > 0) {
      let res = Linter.tryDecompileCompile(statements, compilerConfig)
      if (res.decompilerException) {
        exception = res.decompilerException
      } else {
        statements.splice(0, statements.length, ...res.newStatements)
        compilerExceptions = res.newCompilerExceptions
        if (compilerExceptions.fatal.length > 0) {
          exception = compilerExceptions.fatal[0]
        }
      }

      if (exception) {
        toRemove = exception.statement
        if (toRemove) {
          while (toRemove && !(toRemove instanceof PrimaryStatement)) {
            toRemove = toRemove.parent
          }

          if (toRemove) {
            statements.splice(statements.indexOf(toRemove), 1)
            changed = true
          } else {
            throw new Error("No primary statement found in exception statement parents: " + JSON.stringify(compilerExceptions.fatal[0].statement))
          }
        } else {
          throw new Error("There is still an exception but no statement to remove: " + JSON.stringify(exception))
        }
      }

      exception = null
      toRemove = null
    }

    return changed
  }

  static removeInvalidStatements(statements) {
    let changed = false
    for (let i = 0; i < statements.length; i++) {
      if (statements[i] instanceof InvalidStatement) {
        statements.splice(i, 1)
        changed = true
        i--
      }
    }
    return changed
  }

  static tryDecompileCompile(statements, compilerConfig) {
    const decompiler = new Decompiler(statements, compilerConfig)

    decompiler.decompile()
    if (decompiler.exception) {
      return {
        decompilerException: decompiler.exception
      }
    }

    const compiler = new Compiler(decompiler.code, compilerConfig)
    compiler.compile()

    return {
      newCompilerExceptions: compiler.exceptions,
      newStatements: compiler.statements
    }
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