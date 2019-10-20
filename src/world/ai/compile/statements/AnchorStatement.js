import PrimaryStatement from './PrimaryStatement'
import JumpStatement from './JumpStatement'
import {
  MismatchStatementException
} from '../CompilerException'
import {
  NotDecompilableStatementException
} from '../DecompilerException'

export default class AnchorStatement extends PrimaryStatement {

  constructor(line, column) {
    super('AnchorStatement', line, column)
    this.name = null
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  compile(config, context) {
    this.checkIsAllowed(config, 'type_anchor')

    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(AnchorStatement.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as an anchor statement a statement which is not one', this, {
        template: 'exception_mismatch_statement_template',
        values: {
          statementType: {
            template: 'type_anchor'
          }
        }
      })
    }

    this.name = res[1]
  }

  decompile(indent, line, column) {
    super.decompile(line, column)

    if (!this.name) {
      throw new NotDecompilableStatementException('this anchor has no name', this)
    }

    this.code = [`${this.name}:`]
    this.indentCode(indent)

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
      if (number26.length > 1 && i < number26.length - 1) {
        char--
      }
      name += String.fromCharCode(char)
    }
    return name
  }
}

AnchorStatement.startLineRegExp = /^\s*(\w+)\s*:/
AnchorStatement.codeRegExp = /^\s*(\w+)\s*:\s*$/