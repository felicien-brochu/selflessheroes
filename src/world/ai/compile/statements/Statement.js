export default class Statement {
  constructor(type, parent, line, column = 0) {
    this.type = type
    this.parent = parent
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

  getCodeBoundaries() {
    return {
      start: {
        line: this.line,
        column: this.column
      },
      end: {
        line: this.line + this.code.length - 1,
        column: this.code[this.code.length - 1].length - 1
      }
    }
  }

  getTrimedCodeBoundaries() {
    let line
    let column
    let i = 0
    let j = 0

    loop:
      for (i = 0; i < this.code.length; i++) {
        for (j = 0; j < this.code[i].length; j++) {
          if (this.code[i].charAt(j).trim().length !== 0) {
            break loop
          }
        }
      }

    line = this.line + i
    column = j
    if (line === this.line) {
      column += this.column
    }
    let start = {
      line: line,
      column: column
    }

    i = this.code.length - 1
    j = this.code[i].length - 1
    loopInverse:
      for (i = this.code.length - 1; i >= 0; i--) {
        for (j = this.code[i].length - 1; j >= 0; j--) {
          if (this.code[i].charAt(j).trim().length !== 0) {
            break loopInverse
          }
        }
      }
    line = this.line + i
    column = j

    if (line === this.line) {
      column += this.column
    }
    let end = {
      line: line,
      column: column
    }

    if (start.line > end.line || (start.line === end.line && start.column > end.column)) {
      start.line = this.line
      start.column = this.column
      end.line = this.line
      end.column = this.column + 1
    }

    return {
      start: start,
      end: end
    }
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

  decompile(indent, line, column) {
    this.line = line
    this.column = column
  }

  static isValid(code) {
    return this.codeRegExp.test(code.trim())
  }
}

Statement.undefinedCode = 'undefined'