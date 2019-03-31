import PrimaryStatement from './PrimaryStatement'
import {
  MismatchStatementException
} from '../exceptions/CompilerException'

const startLineRegExp = /^\s*jump/
const codeRegExp = /^\s*jump\s+(\w+)\s*$/
export default class JumpStatement extends PrimaryStatement {

  constructor(line, column = 0) {
    super('JumpStatement', line, column)
    this.anchor = null
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
      throw new MismatchStatementException('You try to compile as a jump statement a statement which is not one', this)
    }

    this.anchor = res[1]
  }
}