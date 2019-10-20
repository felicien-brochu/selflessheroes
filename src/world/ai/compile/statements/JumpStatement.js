import PrimaryStatement from './PrimaryStatement'
import {
  MismatchStatementException
} from '../CompilerException'
import {
  NotDecompilableStatementException
} from '../DecompilerException'

export default class JumpStatement extends PrimaryStatement {

  constructor(line, column) {
    super('JumpStatement', line, column)
    this.anchor = null
    this.anchorStatement = null
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  setAnchorStatement(anchorStatement) {
    this.anchorStatement = anchorStatement
    this.anchor = anchorStatement.name
  }

  compile(config, context) {
    this.checkIsAllowed(config, 'type_jump')

    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(JumpStatement.correctCodeRegExp)
    if (!res) {
      throw new MismatchStatementException('jump statements must have a target anchor', this, {
        template: 'exception_mismatch_keyword_template',
        values: {
          statementType: {
            template: 'type_jump'
          }
        }
      })
    }

    this.anchor = res[1]
  }

  decompile(indent, line, column) {
    super.decompile(line, column)

    if (!this.anchor) {
      throw new NotDecompilableStatementException('this jump statement has no anchor', this)
    }

    this.code = [`jump ${this.anchor}`]
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
JumpStatement.correctCodeRegExp = /^\s*jump\s+(\w+)\s*$/
JumpStatement.codeRegExp = /^\s*jump\s+(\w+).*$/
JumpStatement.keyword = 'jump'