import PrimaryStatement from './PrimaryStatement'

export default class EmptyStatement extends PrimaryStatement {

  constructor(line, column) {
    super('EmptyStatement', line, column)
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  compile(config, context) {}

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