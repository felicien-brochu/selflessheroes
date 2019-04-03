import Statement from './Statement'

export default class PrimaryStatement extends Statement {
  constructor(type, parent, line, column = 0) {
    super(type, parent, line, column)
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
}