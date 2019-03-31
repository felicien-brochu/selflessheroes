import PrimaryStatement from './PrimaryStatement'

export default class EmptyStatement extends PrimaryStatement {

  constructor(line, column = 0) {
    super('EmptyStatement', line, column)
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  compile(config) {}

  execute(context) {
    return {
      step: false,
      complete: true,
      goto: null,
      action: null
    }
  }
}

EmptyStatement.startLineRegExp = /^\s*$/