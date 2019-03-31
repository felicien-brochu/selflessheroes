import PrimaryStatement from './PrimaryStatement'
import {
  MismatchStatementException
} from '../exceptions/CompilerException'

const startLineRegExp = /^\s*(\w+)\s*:/
const codeRegExp = /^\s*(\w+)\s*:\s*$/
export default class AnchorStatement extends PrimaryStatement {

  constructor(line, column = 0) {
    super('AnchorStatement', line, column)
    this.name = null
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
      throw new MismatchStatementException('You try to compile as an anchor statement a statement which is not one', this)
    }

    this.name = res[1]
  }
}