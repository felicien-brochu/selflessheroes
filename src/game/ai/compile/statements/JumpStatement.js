import PrimaryStatement from './PrimaryStatement'
import {
  MismatchStatementException
} from '../CompilerException'

const startLineRegExp = /^\s*jump/
const codeRegExp = /^\s*jump\s+(\w+)\s*$/
export default class JumpStatement extends PrimaryStatement {

  constructor(line, column = 0) {
    super('JumpStatement', line, column)
    this.anchor = null
    this.anchorStatement = null
  }

  static matchLine(line) {
    return startLineRegExp.test(line)
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  setAnchorStatement(anchorStatement) {
    this.anchorStatement = anchorStatement
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(codeRegExp)
    if (!res) {
      throw new MismatchStatementException('jump statements must have a target anchor', this)
    }

    this.anchor = res[1]
  }
}