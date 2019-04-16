import PrimaryStatement from './PrimaryStatement'

export default class EmptyStatement extends PrimaryStatement {

  constructor(parent, line, column = 0) {
    super('EmptyStatement', parent, line, column)
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  compile(config) {}

  decompile(indent, line, column) {
    super.decompile(indent, line, column)
    this.code = ['']

    return true
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

EmptyStatement.startLineRegExp = /^\s*$/