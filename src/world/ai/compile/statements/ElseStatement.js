import PrimaryStatement from './PrimaryStatement'
import {
  MismatchStatementException
} from '../CompilerException'

export default class ElseStatement extends PrimaryStatement {

  constructor(line, column) {
    super('ElseStatement', line, column)
    this.keyword = 'else'
    this.endIfStatement = null
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  setEndIfStatement(endIfStatement) {
    this.endIfStatement = endIfStatement
  }

  compile(config, context) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(ElseStatement.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as an else statement a statement which is not one', this)
    }
  }

  decompile(indent, line, column) {
    super.decompile(indent, line, column)
    this.code = ['else']
    this.indentCode(indent)

    return true
  }

  execute(context) {
    return {
      step: false,
      complete: true,
      goto: null,
      action: null
    }
  }

  getBeforeIndent() {
    return -1
  }

  getAfterIndent() {
    return 1
  }
}

ElseStatement.startLineRegExp = /^\s*else/
ElseStatement.codeRegExp = /^\s*else\s*$/