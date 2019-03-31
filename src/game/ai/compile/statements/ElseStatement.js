import PrimaryStatement from './PrimaryStatement'
import {
  MismatchStatementException
} from '../CompilerException'

export default class ElseStatement extends PrimaryStatement {

  constructor(line, column = 0) {
    super('ElseStatement', line, column)
    this.endIfStatement = null
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  setEndIfStatement(endIfStatement) {
    this.endIfStatement = endIfStatement
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(ElseStatement.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as an else statement a statement which is not one', this)
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

ElseStatement.startLineRegExp = /^\s*else/
ElseStatement.codeRegExp = /^\s*else\s*$/