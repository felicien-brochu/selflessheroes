import Statement from './Statement'
import {
  ForbiddenPrimaryStatementException
} from '../CompilerException'
import StepPriority from '../../StepPriority'

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

  static get keyword() {
    return this.hasOwnProperty('_keyword') ? this._keyword : undefined
  }

  static set keyword(keyword) {
    this._keyword = keyword
  }

  static matchLine(line) {
    return this.startLineRegExp.test(line)
  }

  isCodeComplete() {
    throw new Error('Needs subclass implementation.')
  }

  checkIsAllowed(config, statementTypeTemplate) {
    if (!config.getAllowedPrimaryStatements().includes(this.constructor)) {
      throw new ForbiddenPrimaryStatementException(`you try to compile a primary statement which is not allowed`, this, {
        template: 'exception_forbidden_primary_statement_template',
        values: {
          statementType: {
            template: statementTypeTemplate
          }
        }
      })
    }
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

  getStepPriority() {
    return StepPriority.NORMAL
  }
}