const FunctionMixin = {
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