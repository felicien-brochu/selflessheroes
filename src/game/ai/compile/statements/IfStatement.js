import PrimaryStatement from './PrimaryStatement'
import BooleanExpression from './BooleanExpression'
import {
  MismatchStatementException
} from '../exceptions/CompilerException'

import {
  indexOfStringInLines
} from '../utils'

const startLineRegExpStr = '^\\s*if\\s+.*$'
const startLineRegExp = /^\s*if/
const codeRegExp = /^\s*if\s+(.+)\s*:\s*$/

export default class IfStatement extends PrimaryStatement {
  constructor(line, column = 0) {
    super('IfStatement', line, column)
    this.condition = null
  }

  static matchLine(line) {
    return startLineRegExp.test(line)
  }

  isCodeComplete() {
    return codeRegExp.test(this.code.join(' '))
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let groups = joinedCode.match(codeRegExp)
    if (!groups) {
      throw new MismatchStatementException('You try to compile as a if statement a statement which is not one', this)
    }

    let conditionStr = groups[1]
    let position = indexOfStringInLines(conditionStr, this.code)[0]

    this.condition = new BooleanExpression(this.line + position.start.line, position.start.column)
    for (let i = position.start.line; i <= position.end.line; i++) {
      let line = this.code[i]
      if (i === position.start.line) {
        line = line.substring(position.start.column)
      }
      if (i === position.end.line) {
        line = line.substring(0, line.length - (this.code[i].length - position.end.column))
      }
      this.condition.pushLine(line)
    }

    this.condition.compile(config)
  }
}