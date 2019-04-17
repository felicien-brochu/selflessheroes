import PrimaryStatement from './PrimaryStatement'
import BooleanExpression from './BooleanExpression'
import {
  MismatchStatementException
} from '../CompilerException'
import {
  NotDecompilableStatementException
} from '../DecompilerException'

import {
  indexOfStringInLines,
  subCode
} from '../utils'

export default class IfStatement extends PrimaryStatement {
  constructor(line, column) {
    super('IfStatement', line, column)
    this.keyword = 'if'
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

  compile(config, context) {
    let joinedCode = this.code.join(' ')
    let groups = joinedCode.match(IfStatement.codeRegExp)
    if (!groups) {
      throw new MismatchStatementException('you try to compile as a if statement a statement which is not one', this)
    }

    let conditionStr = groups[1]
    let position = indexOfStringInLines(conditionStr, this.code)[0]

    this.condition = new BooleanExpression(this, this.line + position.start.line, position.start.column)
    let subcode = subCode(this.code, position.start.line, position.start.column, position.end.line, position.end.column)
    this.condition.pushLines(subcode)

    this.condition.compile(config, context)
  }

  decompile(indent, line, column) {
    super.decompile(indent, line, column)

    let executable = true
    let code = 'if '

    if (!this.condition) {
      throw new NotDecompilableStatementException('this if statement has no condition', this)
    }

    executable &= this.condition.decompile(indent, line, this.column + indent + code.length)

    this.code = []
    for (let i = 0; i < this.condition.code.length; i++) {
      let line = i === 0 ? code : ''
      line += this.condition.code[i]
      if (i === this.condition.code.length - 1) {
        line += ' :'
      }
      this.code.push(line)
    }
    this.indentCode(indent)

    return executable
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

  getAfterIndent() {
    return 1
  }
}

IfStatement.codeRegExp = /^\s*if\s+(.+)\s*:\s*$/
IfStatement.startLineRegExp = /^\s*if/