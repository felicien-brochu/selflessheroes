import PrimaryStatement from './PrimaryStatement'
import {
  MismatchStatementException,
  InvalidVariableIdentifierException,
  InvalidExpressionException
} from '../CompilerException'
import {
  NotDecompilableStatementException
} from '../DecompilerException'
import {
  indexOfStringInLines,
  createUnitExpression
} from '../utils'

import VariableIdentifier from './VariableIdentifier'
import ValueFunctions from './functions/ValueFunctions'
import IntegerLiteral from './literals/IntegerLiteral'
import DirectionLiteral from './literals/DirectionLiteral'
import InvalidExpression from './InvalidExpression'

const assignOperator = '='

export default class AssignStatement extends PrimaryStatement {
  constructor(line, column) {
    super('AssignStatement', line, column)

    this.variable = null
    this.value = null
  }

  isCodeComplete() {
    return AssignStatement.codeRegExp.test(this.code.join(' '))
  }

  compile(config, context) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(AssignStatement.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as an assign statement a statement which is not one', this)
    }

    let operatorPosition = indexOfStringInLines(assignOperator, this.code)
    operatorPosition = operatorPosition[0]
    this.composite = false

    let variableCode = this.code.slice(0, operatorPosition.start.line + 1)
    let valueCode = this.code.slice(operatorPosition.start.line)

    variableCode[variableCode.length - 1] = variableCode[variableCode.length - 1].substring(0, operatorPosition.start.column)
    valueCode[0] = valueCode[0].substring(operatorPosition.end.column)

    this.variable = createUnitExpression(variableCode, [VariableIdentifier], this, this.line, this.column)

    if (this.variable.type === 'InvalidExpression') {
      throw new InvalidVariableIdentifierException('this identifier is not a valid variable identifier', this.variable)
    }

    this.variable.compile(config, context)

    console.log("###ASSIGN", this)
    this.value = createUnitExpression(valueCode, [IntegerLiteral, DirectionLiteral, VariableIdentifier, ...Object.values(ValueFunctions)],
      this, this.line + operatorPosition.end.line, operatorPosition.end.column)

    if (this.value.type === 'InvalidExpression') {
      throw new InvalidExpressionException('this identifier is neither a value function, an integer literal or a valid variable identifier', this.value)
    }
    this.value.compile(config, context)
  }

  decompile(indent, line, column) {
    super.decompile(indent, line, column)

    let executable = true
    let code = ''

    if (!this.value) {
      throw new NotDecompilableStatementException('this assign statement has no value', this)
    }

    let variable = this.undefinedCode
    if (this.variable) {
      executable &= this.variable.decompile(indent, line, this.column + indent + code.length)
      variable = this.variable.code[0]
    } else {
      executable = false
    }

    code += `${variable} = `

    let value = this.undefinedCode
    if (this.value) {
      executable &= this.value.decompile(indent, line, this.column + indent + code.length)
      value = this.value.code[0]
    } else {
      executable = false
    }

    code += value
    this.code = [code]
    this.indentCode(indent)

    return executable
  }

  execute(context) {
    context.variables[this.variable.name] = this.value.computeValue(context)
    return {
      step: true,
      complete: true,
      goto: null,
      action: null
    }
  }
}

AssignStatement.startLineRegExp = /^\s*(\w+)\s*=\s*(.+)\s*$/
AssignStatement.codeRegExp = /^\s*(\w+)\s*=\s*(.+)\s*$/