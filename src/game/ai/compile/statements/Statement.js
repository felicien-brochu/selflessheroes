export default class Statement {
  constructor(type, line, column = 0) {
    this.type = type
    this.line = line
    this.column = column
    this.code = []
  }

  static get codeRegExp() {
    return this.hasOwnProperty('_codeRegExp') ? this._codeRegExp : undefined
  }

  static set codeRegExp(regexp) {
    this._codeRegExp = regexp
  }

  pushLine(line) {
    this.code.push(line)
  }

  pushLines(lines) {
    this.code = this.code.concat(lines)
  }

  compile(config) {
    throw new Error('Needs subclass implementation')
  }

  static isValid(code) {
    return this.codeRegExp.test(code.trim())
  }
}