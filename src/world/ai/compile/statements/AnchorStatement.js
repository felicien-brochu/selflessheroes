import PrimaryStatement from './PrimaryStatement'
import {
  MismatchStatementException
} from '../CompilerException'

export default class AnchorStatement extends PrimaryStatement {

  constructor(parent, line, column = 0) {
    super('AnchorStatement', parent, line, column)
    this.name = null
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(AnchorStatement.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as an anchor statement a statement which is not one', this)
    }

    this.name = res[1]
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

AnchorStatement.startLineRegExp = /^\s*(\w+)\s*:/
AnchorStatement.codeRegExp = /^\s*(\w+)\s*:\s*$/