export default class CompilerException extends Error {
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

class StatementException extends CompilerException {
  constructor(type, message, statement) {
    super(type, message, statement.line, statement.column, statement.code)
  }
}

export class InvalidStatementException extends StatementException {
  constructor(message, statement) {
    super('InvalidStatementException', message, statement)
  }
}

export class IfWithoutEndIfException extends StatementException {
  constructor(message, statement) {
    super('IfWithoutEndIfException', message, statement)
  }
}

export class ElseWithoutIfException extends StatementException {
  constructor(message, statement) {
    super('ElseWithoutIfException', message, statement)
  }
}

export class EndIfWithoutIfException extends StatementException {
  constructor(message, statement) {
    super('EndIfWithoutIfException', message, statement)
  }
}

export class JumpToUnknownAnchorException extends StatementException {
  constructor(message, statement) {
    super('JumpToUnknownAnchorException', message, statement)
  }
}

export class DuplicateAnchorException extends StatementException {
  constructor(message, statement) {
    super('JumpToUnknownAnchorException', message, statement)
  }
}


export class MismatchStatementException extends StatementException {
  constructor(message, statement) {
    super('MismatchStatementException', message, statement)
  }
}

export class ForbiddenVariableIdentifierException extends StatementException {
  constructor(message, statement) {
    super('ForbiddenVariableIdentifierException', message, statement)
  }
}

export class ForbiddenValueFunctionException extends StatementException {
  constructor(message, statement) {
    super('ForbiddenValueFunctionException', message, statement)
  }
}

export class ForbiddenActionFunctionException extends StatementException {
  constructor(message, statement) {
    super('ForbiddenActionFunctionException', message, statement)
  }
}

export class ForbiddenObjectTypeLiteralException extends StatementException {
  constructor(message, statement) {
    super('ForbiddenObjectTypeLiteralException', message, statement)
  }
}

export class ForbiddenTerrainTypeLiteralException extends StatementException {
  constructor(message, statement) {
    super('ForbiddenTerrainTypeLiteralException', message, statement)
  }
}

export class InvalidExpressionException extends StatementException {
  constructor(message, statement) {
    super('InvalidExpressionException', message, statement)
  }
}

export class InvalidVariableIdentifierException extends StatementException {
  constructor(message, statement) {
    super('InvalidVariableIdentifierException', message, statement)
  }
}

export class InvalidBooleanExpressionException extends StatementException {
  constructor(message, statement) {
    super('InvalidBooleanExpressionException', message, statement)
  }
}

export class UnknownFunctionException extends StatementException {
  constructor(message, statement) {
    super('UnknownFunctionException', message, statement)
  }
}

export class InvalidFunctionParamsException extends StatementException {
  constructor(message, statement) {
    super('InvalidFunctionParamsException', message, statement)
  }
}

export class InvalidNumberOfParamsException extends StatementException {
  constructor(message, statement) {
    super('InvalidNumberOfParamsException', message, statement)
  }
}