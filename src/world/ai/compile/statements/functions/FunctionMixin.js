import PrimaryStatement from '../PrimaryStatement'
import {
  NotDecompilableStatementException
} from '../../DecompilerException'

const FunctionMixin = {
  decompile(indent, line, column) {
    this.line = line
    this.column = column

    let executable = true
    let code = `${this.keyword}(`

    for (let i = 0; i < this.params.length; i++) {
      if (i > 0) {
        code += ', '
      }
      let param = this.undefinedCode
      if (this.params[i]) {
        executable &= this.params[i].decompile(indent, line, this.column + code.length)
        param = this.params[i].code[0]
      } else {
        executable = false
      }
      code += param
    }

    code += ')'
    this.code = [code]
    if (this instanceof PrimaryStatement) {
      this.indentCode(indent)
    }

    return executable
  },

  getParamTypeAt(param, index) {
    let types = this.getParamTypes()
    let paramTypes
    if (index >= types.length) {
      paramTypes = types[types.length - 1]
    } else {
      paramTypes = types[index]
    }

    let paramType = paramTypes.find(type => param instanceof type.type ||
      (Array.isArray(param) && type.multiple && param[0] instanceof type.type))

    return paramType
  },

  getParamTypes() {
    throw new Error('Needs subclass implementation.')
  },

  getParamCurrentType(index) {
    return this.getParamTypeAt(this.params[index], index)
  }
}

export default FunctionMixin