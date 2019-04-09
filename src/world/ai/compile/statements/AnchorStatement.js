import PrimaryStatement from './PrimaryStatement'
import JumpStatement from './JumpStatement'
import {
  MismatchStatementException
} from '../CompilerException'

export default class AnchorStatement extends PrimaryStatement {

  constructor(parent, line, column = 0) {
    super('AnchorStatement', parent, line, column)
    this.name = null
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  compile(config) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(AnchorStatement.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as an anchor statement a statement which is not one', this)
    }

    this.name = res[1]
  }

  execute(context) {
    return {
      step: false,
      complete: true,
      goto: null,
      action: null
    }
  }

  findPointingJumpStatements(statements) {
    return statements.filter(statement => statement instanceof JumpStatement && statement.anchorStatement === this)
  }

  static getAvailableName(statements) {
    let names = statements.filter(statement => statement instanceof AnchorStatement)
      .map(anchor => anchor.name)
    let name = null

    for (let i = 0; !name; i++) {
      let proposedName = AnchorStatement.getSequentialName(i)
      if (names.indexOf(proposedName) < 0) {
        name = proposedName
      }
    }
    return name
  }

  static getSequentialName(number) {
    let number26 = number.toString(26)
    let name = ""

    for (let i = 0; i < number26.length; i++) {
      let char = number26.charCodeAt(i)
      if (char >= 0x61 && char <= 0x7A) {
        char += 0xA
      } else {
        char += 0x31
      }
      name += String.fromCharCode(char)
    }
    return name
  }
}

AnchorStatement.startLineRegExp = /^\s*(\w+)\s*:/
AnchorStatement.codeRegExp = /^\s*(\w+)\s*:\s*$/