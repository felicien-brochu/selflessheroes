import PrimaryStatement from './PrimaryStatement'
import {
  MismatchStatementException
} from '../CompilerException'

export default class EndIfStatement extends PrimaryStatement {

  constructor(line, column = 0) {
    super('EndIfStatement', line, column)
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

  execute(context) {
    return {
      step: false,
      complete: true,
      goto: null,
      action: null
    }
  }
}

EndIfStatement.startLineRegExp = /^\s*endif/
EndIfStatement.codeRegExp = /^\s*endif\s*$/