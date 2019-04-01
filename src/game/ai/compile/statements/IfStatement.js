import PrimaryStatement from './PrimaryStatement'
import BooleanExpression from './BooleanExpression'
import {
  MismatchStatementException
} from '../CompilerException'

import {
  indexOfStringInLines,
  subCode
} from '../utils'

export default class IfStatement extends PrimaryStatement {
  constructor(line, column = 0) {
    super('IfStatement', line, column)
    this.condition = null
    this.elseStatement = null
    this.endIfStatement = null
  }

  isCodeComplete() {
    return IfStatement.codeRegExp.test(this.code.join(' '))
  }

  setElseStatement(elseStatement) {
    this.elseStatement = elseStatement
  }

  setEndIfStatement(endIfStatement) {
    this.endIfStatement = endIfStatement

    if (this.elseStatement) {
      this.elseStatement.setEndIfStatement(endIfStatement)
    }
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let groups = joinedCode.match(IfStatement.codeRegExp)
    if (!groups) {
      throw new MismatchStatementException('you try to compile as a if statement a statement which is not one', this)
    }

    let conditionStr = groups[1]
    let position = indexOfStringInLines(conditionStr, this.code)[0]

    this.condition = new BooleanExpression(this.line + position.start.line, position.start.column)
    let subcode = subCode(this.code, position.start.line, position.start.column, position.end.line, position.end.column)
    this.condition.pushLines(subcode)

    this.condition.compile(config)
  }

  execute(context) {
    let goto = null
    if (!this.condition.computeValue(context).value) {
      goto = this.elseStatement ? this.elseStatement : this.endIfStatement
    }
    return {
      step: true,
      complete: true,
      goto: goto,
      action: null
    }
  }
}

IfStatement.codeRegExp = /^\s*if\s+(.+)\s*:\s*$/
IfStatement.startLineRegExp = /^\s*if/