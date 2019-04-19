import UndefinedLiteral from '../../../world/ai/compile/statements/literals/UndefinedLiteral'

export default {
  computed: {
    params: function() {
      let params = []

      if (this.func) {
        let types = this.func.getParamTypes()
        for (let i = 0; i < this.func.params.length || i < types.length; i++) {
          let value = this.func.params[i]
          if (value instanceof UndefinedLiteral) {
            value = null
          }
          let currentType = this.func.getParamCurrentType(i)
          if (i < types.length) {
            if (currentType && currentType.multiple) {
              value = [value]
            }
            params.push({
              value: value,
              types: types[i]
            })
          } else {
            let param = params[params.length - 1]
            param.value.push(this.func.params[i])
          }
        }
      }

      return params
    }
  },

  methods: {
    handleSelectParam(index, value) {
      let types = this.func.getParamTypes()
      let params = this.func.params.slice(0)
      if (Array.isArray(value)) {
        params = params.slice(0, index)
        if (index === types.length - 1 && value.length > 0 && this.func.getParamTypeAt(value, index).multiple) {
          for (let i = 0; i < value.length; i++) {
            let param = value[i]
            param.parent = this.func
            params[index + i] = param
          }
        } else {
          params[index] = null
        }
      } else {
        value.parent = this.func
        params[index] = value
      }

      this.func.params = params
      this.$emit('change', this)
    }
  }
}