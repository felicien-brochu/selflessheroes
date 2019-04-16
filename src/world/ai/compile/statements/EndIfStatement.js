import PrimaryStatement from './PrimaryStatement'
import {
  MismatchStatementException
} from '../CompilerException'

export default class EndIfStatement extends PrimaryStatement {

  constructor(parent, line, column = 0) {
    super('EndIfStatement', parent, line, column)
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(EndIfStatement.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as an endif statement a statement which is not one', this)
    }
  }

  decompile(indent, line, column) {
    super.decompile(indent, line, column)
    this.code = ['endif']
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
}

EndIfStatement.startLineRegExp = /^\s*endif/
EndIfStatement.codeRegExp = /^\s*endif\s*$/