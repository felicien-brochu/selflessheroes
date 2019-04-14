<template>
<li class="node action-node"
  @mousedown="handleDragStart"
  @touchstart="handleDragStart">

  <div class="function-label">
    {{statement.keyword}}
  </div>

  <value-select v-for="(param, index) in params"
    :key="index"
    :types="param.types"
    :value="param.value"
    @select="handleSelectParam(index, $event)" />

</li>
</template>

<script>
import Node from './Node'
import ValueSelect from './ValueSelect'

export default {
  components: {
    ValueSelect
  },
  extends: Node,
  props: {},
  computed: {
    params: function() {
      let params = []
      let types = this.statement.getParamTypes()
      for (let i = 0; i < this.statement.params.length || i < types.length; i++) {
        let value = this.statement.params[i]
        let currentType = this.statement.getParamCurrentType(i)
        if (i < types.length) {
          if (currentType && currentType.multiple) {
            value = [value]
          }
          params.push({
            value: value,
            types: types[i]
          })
        }
        else {
          let param = params[params.length - 1]
          param.value.push(this.statement.params[i])
        }
      }

      return params
    }
  },

  methods: {
    handleSelectParam(index, value) {
      let types = this.statement.getParamTypes()
      let params = this.statement.params.slice(0)
      if (Array.isArray(value)) {
        params = params.slice(0, index)
        if (index === types.length - 1 && value.length > 0 && this.statement.getParamTypeAt(value, index).multiple) {
          for (let i = 0; i < value.length; i++) {
            let param = value[i]
            param.parent = this.statement
            params[index + i] = param
          }
        }
        else {
          params[index] = null
        }
      }
      else {
        value.parent = this.statement
        params[index] = value
      }

      this.statement.params = params
    }
  }
}
</script>

<style lang="scss">
.action-node {
    display: flex;
    align-items: center;
    padding-right: 10px;

    .function-label {
        margin-right: 5px;
        pointer-events: none;
    }

    .value-select {
        margin-left: 5px;
    }
}
</style>
