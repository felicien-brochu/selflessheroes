import PrimaryStatement from './PrimaryStatement'
import {
  MismatchStatementException
} from '../CompilerException'

const startLineRegExp = /^\s*endif/
const codeRegExp = /^\s*endif\s*$/

export default class EndIfStatement extends PrimaryStatement {

  constructor(line, column = 0) {
    super('EndIfStatement', line, column)
  }

  static matchLine(line) {
    return startLineRegExp.test(line)
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as an endif statement a statement which is not one', this)
    }
  }
}