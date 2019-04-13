import IfStatement from '../../world/ai/compile/statements/IfStatement'
import EndIfStatement from '../../world/ai/compile/statements/EndIfStatement'
import AnchorStatement from '../../world/ai/compile/statements/AnchorStatement'

function getLineNumbersFromStatements(statements) {
  let lineNumbers = []
  let line = 1
  for (let statement of statements) {
    if (statement instanceof AnchorStatement) {
      lineNumbers.push(' ')
    } else if (statement instanceof EndIfStatement) {
      continue
    } else {
      lineNumbers.push(line.toString())
      line++

      // Insert empty lines for condition nodes
      if (statement instanceof IfStatement) {
        for (let i = 0; i < statement.condition.expressions.length - 1; i++) {
          lineNumbers.push(' ')
        }

        // Insert line for empty if with else and empty if
        if ((statement.elseStatement && statements.indexOf(statement.elseStatement) - statements.indexOf(statement) === 1) ||
          statements.indexOf(statement.endIfStatement) - statements.indexOf(statement) === 1) {
          lineNumbers.push(' ')
        }
      }
    }
  }
  return lineNumbers
}

export {
  getLineNumbersFromStatements
}