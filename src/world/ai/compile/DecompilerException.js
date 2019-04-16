export default class DecompilerException extends Error {
  constructor(type, message, line, column = 0, code = null) {
    super(message)
    this.name = type
    this.line = line
    this.column = column
    this.code = code
    this.message = this.format(message)
  }

  format(message) {
    return `\nat ${this.line + 1}:${this.column + 1} : ${message}\n"${this.code.join('\n')}"`
  }
}

class StatementException extends DecompilerException {
  constructor(type, message, statement) {
    super(type, message, statement.line, statement.column, statement.code)
    this.statement = statement
  }
}

export class NotDecompilableStatementException extends StatementException {
  constructor(message, statement) {
    super('NotDecompilableStatementException', message, statement)
  }
}