import PrimaryStatement from './PrimaryStatement'
import {
  MismatchStatementException
} from '../CompilerException'

const startLineRegExp = /^\s*else/
const codeRegExp = /^\s*else\s*$/
export default class ElseStatement extends PrimaryStatement {

  constructor(line, column = 0) {
    super('ElseStatement', line, column)
    this.endIfStatement = null
  }

  static matchLine(line) {
    return startLineRegExp.test(line)
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  setEndIfStatement(endIfStatement) {
    this.endIfStatement = endIfStatement
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as an else statement a statement which is not one', this)
    }
  }
}