import PrimaryStatement from './PrimaryStatement'
import {
  MismatchStatementException
} from '../CompilerException'
import {
  NotDecompilableStatementException
} from '../DecompilerException'

export default class JumpStatement extends PrimaryStatement {

  constructor(parent, line, column = 0) {
    super('JumpStatement', parent, line, column)
    this.keyword = 'jump'
    this.anchor = null
    this.anchorStatement = null
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  setAnchorStatement(anchorStatement) {
    this.anchorStatement = anchorStatement
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(JumpStatement.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('jump statements must have a target anchor', this)
    }

    this.anchor = res[1]
  }

  decompile(indent, line, column) {
    super.decompile(line, column)

    if (!this.anchor) {
      throw new NotDecompilableStatementException('this jump statement has no anchor', this)
    }

    this.code = [`jump ${this.anchor}:`]
    this.indentCode(indent)

    return true
  }

  execute(context) {
    return {
      step: true,
      complete: true,
      goto: this.anchorStatement,
      action: null
    }
  }
}

JumpStatement.startLineRegExp = /^\s*jump/
JumpStatement.codeRegExp = /^\s*jump\s+(\w+)\s*$/