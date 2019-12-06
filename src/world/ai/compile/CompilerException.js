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
  constructor(type, message, statement, template) {
    super(type, message, statement.line, statement.column, statement.code)
    this.statement = statement
    this.template = template
  }
}

export class InvalidStatementException extends StatementException {
  constructor(message, statement, template) {
    super('InvalidStatementException', message, statement, template)
  }
}

// Compiler level exceptions
export class IfWithoutEndIfException extends StatementException {
  constructor(message, statement, template) {
    super('IfWithoutEndIfException', message, statement, template)
  }
}

export class ElseWithoutIfException extends StatementException {
  constructor(message, statement, template) {
    super('ElseWithoutIfException', message, statement, template)
  }
}

export class EndIfWithoutIfException extends StatementException {
  constructor(message, statement, template) {
    super('EndIfWithoutIfException', message, statement, template)
  }
}

export class JumpToUnknownAnchorException extends StatementException {
  constructor(message, statement, template) {
    super('JumpToUnknownAnchorException', message, statement, template)
  }
}

export class DuplicateAnchorException extends StatementException {
  constructor(message, statement, template) {
    super('DuplicateAnchorException', message, statement, template)
  }
}

export class OpenStatementException extends StatementException {
  constructor(message, statement, template) {
    super('OpenStatementException', message, statement, template)
  }
}



// Statement level exceptions
export class MismatchStatementException extends StatementException {
  constructor(message, statement, template) {
    super('MismatchStatementException', message, statement, template)
  }
}

export class ForbiddenPrimaryStatementException extends StatementException {
  constructor(message, statement, template) {
    super('ForbiddenPrimaryStatementException', message, statement, template)
  }
}

export class ForbiddenExpressionTypeException extends StatementException {
  constructor(message, statement, template) {
    super('ForbiddenExpressionTypeException', message, statement, template)
  }
}

export class ForbiddenVariableIdentifierException extends StatementException {
  constructor(message, statement, template) {
    super('ForbiddenVariableIdentifierException', message, statement, template)
  }
}

export class ForbiddenIntegerLiteralException extends StatementException {
  constructor(message, statement, template) {
    super('ForbiddenIntegerLiteralException', message, statement, template)
  }
}

export class ForbiddenMessageLiteralException extends StatementException {
  constructor(message, statement, template) {
    super('ForbiddenMessageLiteralException', message, statement, template)
  }
}

export class ForbiddenValueFunctionException extends StatementException {
  constructor(message, statement, template) {
    super('ForbiddenValueFunctionException', message, statement, template)
  }
}

export class ForbiddenActionFunctionException extends StatementException {
  constructor(message, statement, template) {
    super('ForbiddenActionFunctionException', message, statement, template)
  }
}

export class ForbiddenObjectTypeLiteralException extends StatementException {
  constructor(message, statement, template) {
    super('ForbiddenObjectTypeLiteralException', message, statement, template)
  }
}

export class ForbiddenTerrainTypeLiteralException extends StatementException {
  constructor(message, statement, template) {
    super('ForbiddenTerrainTypeLiteralException', message, statement, template)
  }
}

export class InvalidExpressionException extends StatementException {
  constructor(message, statement, template) {
    super('InvalidExpressionException', message, statement, template)
  }
}

export class InvalidVariableIdentifierException extends StatementException {
  constructor(message, statement, template) {
    super('InvalidVariableIdentifierException', message, statement, template)
  }
}

export class InvalidBooleanExpressionException extends StatementException {
  constructor(message, statement, template) {
    super('InvalidBooleanExpressionException', message, statement, template)
  }
}

export class UnknownFunctionException extends StatementException {
  constructor(message, statement, template) {
    super('UnknownFunctionException', message, statement, template)
  }
}

export class InvalidFunctionParamsException extends StatementException {
  constructor(message, statement, template) {
    super('InvalidFunctionParamsException', message, statement, template)
  }
}

export class InvalidNumberOfParamsException extends StatementException {
  constructor(message, statement, template) {
    super('InvalidNumberOfParamsException', message, statement, template)
  }
}