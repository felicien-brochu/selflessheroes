import Expression from '../Expression'
import DirectionLiteral from '../literals/DirectionLiteral'
import Direction from '../../../../Direction'
import {
  MismatchStatementException,
  InvalidNumberOfParamsException,
  InvalidFunctionParamsException,
  ForbiddenValueFunctionException,
  ForbiddenActionFunctionException
} from '../../CompilerException'
import {
  indexOfStringInLines,
  splitCode,
  subCode,
  createUnitExpression
} from '../../utils'

class FunctionExpression extends Expression {
  constructor(type, parent, line, column) {
    super(type, parent, line, column)
    this.params = this.getParamTypes().map(type => null)
  }

  static get keyword() {
    return this.hasOwnProperty('_keyword') ? this._keyword : undefined
  }

  static set keyword(keyword) {
    this._keyword = keyword
  }

  static get codeRegExp() {
    return new RegExp(`^\\s*(${this.keyword}\\s*\\((.*)\\))\\s*$`)
  }

  getAllowedFunctionTypes(config) {
    if (this.parent.type === 'ActionStatement') {
      return config.actionFunctions
    } else if (this.parent.type === 'AssignStatement') {
      return config.valueFunctions
    }
    return []
  }

  compile(config, context) {
    this.checkFunctionGeneralFormat()
    this.checkFunctionTypeIsAllowed(config)
    this.checkFunctionFormat()
    this.compileParams(config, context)
  }

  checkFunctionGeneralFormat() {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(this.constructor.codeRegExp)
    if (!res) {
      this.onInvalidFunctionGeneralFormat()
    }
  }

  checkFunctionTypeIsAllowed(config) {
    let allowedTypes = this.getAllowedFunctionTypes(config)
    if (!allowedTypes.some(allowedType => this instanceof allowedType)) {
      this.onForbiddenFunctionType(config)
    }
  }

  checkFunctionFormat() {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(this.constructor.codeRegExp)
    if (!res) {
      this.onInvalidFunctionFormat()
    }
  }

  compileParams(config, context) {
    let rawParams = this.extractParams()
    let paramTypes = this.getParamTypes()

    if ((this.hasFiniteNumberOfParams() && rawParams.length !== paramTypes.length) ||
      (!this.hasFiniteNumberOfParams() && rawParams.length < paramTypes.length)) {
      this.onInvalidNumberOfParams(rawParams, config, context)
    }

    this.params = []
    rawParams.forEach((param, index) => this.compileParam(param, index, config, context))
  }

  compileParam(paramCode, index, config, context) {
    let paramTypes = this.getParamTypes()
    let allowedTypesIndex = index
    if (!this.hasFiniteNumberOfParams() && allowedTypesIndex >= paramTypes.length) {
      allowedTypesIndex = paramTypes.length - 1
    }
    let allowedTypes = this.getParamTypes()[allowedTypesIndex].map(type => type.type)
    let param = createUnitExpression(paramCode.code, allowedTypes, this, paramCode.line, paramCode.column)
    this.params.push(param)

    if (param.type === 'InvalidExpression') {
      this.onInvalidParam(index, param, config, context)
    }
    param.compile(config, context)

    this.validateParam(param, index, config)

    if (!this.hasFiniteNumberOfParams() && index >= paramTypes.length) {
      this.checkDuplicateParams(param)
    }
  }

  validateParam(param, index, config) {
    const paramType = this.getParamCurrentType(index)
    if (paramType && typeof paramType.validator === 'function' && !paramType.validator(param.value)) {
      this.onParamValidationFailed(param, config)
    }
  }

  checkDuplicateParams(param) {
    let paramTypes = this.getParamTypes()
    if (this.params.some((p, index) => index >= paramTypes.length - 1 && p !== param && p.name === param.name)) {
      this.onDuplicateParams(param)
    }
  }

  onInvalidFunctionGeneralFormat() {
    throw new MismatchStatementException('you try to compile as a function a statement which is not one', this, {
      template: 'exception_mismatch_function_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        }
      }
    })
  }

  onForbiddenFunctionType(config) {
    const allowedTypes = this.getAllowedFunctionTypes(config)
    if (this.parent.type === 'AssignStatement') {
      throw new ForbiddenValueFunctionException(`the function ${this.constructor.keyword} is forbidden. You may use the following functions: ${allowedTypes}`, this, {
        template: 'exception_forbidden_value_function_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          },
          allowedFunctions: allowedTypes.map(func => func.keyword)
        }
      })
    } else if (this.parent.type === 'ActionStatement') {
      throw new ForbiddenActionFunctionException(`the function ${this.constructor.keyword} is forbidden. You may use the following functions: ${allowedTypes}`, this, {
        template: 'exception_forbidden_action_function_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          },
          allowedFunctions: allowedTypes.map(func => func.keyword)
        }
      })
    }
  }

  onInvalidFunctionFormat() {
    throw new MismatchStatementException(`you try to compile as a '${this.constructor.keyword}' function a statement which is not one`, this, {
      template: 'exception_mismatch_function_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        }
      }
    })
  }

  onInvalidNumberOfParams(rawParams, config, context) {
    throw new InvalidNumberOfParamsException(`'${this.constructor.keyword}' function requires ${this.getParamTypes().length} parameters`, this)
  }

  onInvalidParam(index, param, config, context) {
    throw new InvalidFunctionParamsException(`Wrong param for '${this.constructor.keyword}' function`, param)
  }

  onParamValidationFailed(param, config) {
    throw new InvalidFunctionParamsException(`Param validation failed for '${this.constructor.keyword}' function`, param)
  }

  onDuplicateParams(duplicateParam) {
    throw new InvalidFunctionParamsException(`you cannot pass the same parameter twice`, duplicateParam, {
      template: 'exception_duplicate_param_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        },
        param: duplicateParam.code.join(' ').trim()
      }
    })
  }

  decompile(indent, line, column) {
    this.line = line
    this.column = column

    let executable = true
    let code = `${this.constructor.keyword}(`

    for (let i = 0; i < this.params.length; i++) {
      if (i > 0) {
        code += ' '
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

    return executable
  }

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
  }

  getParamTypes() {
    throw new Error('Needs subclass implementation.')
  }

  getParamCurrentType(index) {
    return this.getParamTypeAt(this.params[index], index)
  }

  getParamsJoinedCode() {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(this.constructor.codeRegExp)
    if (res && res.length >= 3) {
      return res[2]
    } else {
      return null
    }
  }

  hasFiniteNumberOfParams() {
    let paramTypes = this.getParamTypes()
    return paramTypes.length === 0 || !paramTypes[paramTypes.length - 1].some(type => type.multiple)
  }

  extractParams() {
    let params = []
    let paramsJoinedCode = this.getParamsJoinedCode()
    if (paramsJoinedCode.trim().length > 0) {
      let position = indexOfStringInLines(`(${paramsJoinedCode})`, this.code)
      position[0].start.column++
      position[0].end.column--
      let code = subCode(this.code, position[0].start.line, position[0].start.column, position[0].end.line, position[0].end.column)
      let codeSplit = [{}, {
        code: code,
        line: this.line + position[0].start.line,
        column: position[0].start.line === 0 ? this.column + position[0].start.column : position[0].start.column
      }]

      while (codeSplit[1].code.join(' ').includes(' ')) {
        codeSplit = splitCode(codeSplit[1].code, ' ', codeSplit[1].line, codeSplit[1].column)

        if (codeSplit[0].code[0].length > 0) {
          params.push({
            code: codeSplit[0].code,
            line: codeSplit[0].line,
            column: codeSplit[0].column
          })
        }
      }

      if (codeSplit[1].code[0].length > 0) {
        params.push({
          code: codeSplit[1].code,
          line: codeSplit[1].line,
          column: codeSplit[1].column
        })
      }
    }

    return params
  }
}

export default FunctionExpression