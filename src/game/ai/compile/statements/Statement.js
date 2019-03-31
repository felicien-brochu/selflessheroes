export default class Statement {
  constructor(type, line, column = 0) {
    this.type = type
    this.line = line
    this.column = column
    this.code = []
  }

  pushLine(line) {
    this.code.push(line)
  }

  pushLines(lines) {
    this.code = this.code.concat(lines)
  }

  compile(config) {
    throw new Error('Needs subclass implementation.')
  }
}