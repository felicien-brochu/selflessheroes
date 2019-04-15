import IfStatement from './statements/IfStatement'

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
}