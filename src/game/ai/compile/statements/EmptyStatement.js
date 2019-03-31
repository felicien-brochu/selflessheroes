import PrimaryStatement from './PrimaryStatement'

const startLineRegExp = /^\s*$/

export default class EmptyStatement extends PrimaryStatement {

  constructor(line, column = 0) {
    super('EmptyStatement', line, column)
  }

  static matchLine(line) {
    return startLineRegExp.test(line)
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  compile(config) {}
}