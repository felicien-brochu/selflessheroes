import Expression from '../Expression'
import ExpressionValue from '../ExpressionValue'
import {
  MismatchStatementException,
  ForbiddenIntegerLiteralException
} from '../../CompilerException'

export default class IntegerLiteral extends Expression {
  constructor(parent, line, column) {
    super('IntegerLiteral', parent, line, column)
    this.value = 0
  }

  compile(config, context) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(IntegerLiteral.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as an integer literal a statement which is not one', this)
    }

    this.value = parseInt(res[1], 10)
    if (this.value < config.minInteger || this.value > config.maxInteger) {
      throw new ForbiddenIntegerLiteralException(`'${this.code.join(' ').trim()}' is out of bound: it must be in range [${config.minInteger}:${config.maxInteger}]`, this, {
        template: 'exception_forbidden_integer_template',
        values: {
          value: this.value,
          min: config.minInteger,
          max: config.maxInteger,
        }
      })
    }
  }

  decompile(indent, line, column) {
    super.decompile(indent, line, column)

    this.code = [`${this.value}`]

    return true
  }

  computeValue(context) {
    return ExpressionValue.integer(this.value)
  }
}

IntegerLiteral.codeRegExp = /^\s*(-?\d+)\s*$/