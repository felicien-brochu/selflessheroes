import Statement from './Statement'

export default class PrimaryStatement extends Statement {
  constructor(type, line, column) {
    super(type, null, line, column)
  }

  static get startLineRegExp() {
    return this.hasOwnProperty('_startLineRegExp') ? this._startLineRegExp : undefined
  }

  static set startLineRegExp(regexp) {
    this._startLineRegExp = regexp
  }

  static matchLine(line) {
    return this.startLineRegExp.test(line)
  }

  isCodeComplete() {
    throw new Error('Needs subclass implementation.')
  }

  execute(context) {
    return {
      step: true,
      complete: true,
      goto: null,
      action: null
    }
    throw new Error('Needs subclass implementation.')
  }

  getBeforeIndent() {
    return 0
  }

  getAfterIndent() {
    return 0
  }

  indentCode(indent) {
    for (let i = 0; i < this.code.length; i++) {
      this.code[i] = PrimaryStatement.indentString(indent) + this.code[i]
    }
  }

  static indentString(indent) {
    let str = ''
    for (let i = 0; i < indent; i++) {
      str += '\t'
    }
    return str
  }
}