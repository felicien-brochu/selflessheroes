<template>
<li class="node assign-node"
  @mousedown="handleDragStart"
  @touchstart="handleDragStart">

  <value-select :types="variableTypes"
    :value="statement.variable"
    parentType="assign"
    @select="handleSelectVariable" />

  <div class="function-label">
    {{`= ${statement.value.keyword}`}}
  </div>

  <value-select v-for="(param, index) in params"
    :key="index"
    :types="param.types"
    :value="param.value"
    parentType="assign"
    @select="handleSelectParam(index, $event)" />

</li>
</template>

<script>
import Node from './Node'
import ValueSelect from './ValueSelect'
import VariableIdentifier from '../../../world/ai/compile/statements/VariableIdentifier'
import FunctionMixin from './FunctionMixin'

export default {
  extends: Node,
  mixins: [FunctionMixin],
  components: {
    ValueSelect
  },
  computed: {
    variableTypes: () => {
      return [{
        type: VariableIdentifier,
        multiple: false
      }]
    }
  },
  data: function() {
    return {
      func: this.statement.value
    }
  },

  methods: {
    handleSelectVariable(variable) {
      variable.parent = this.statement
      this.statement.variable = variable
    }
  }
}
</script>

<style lang="scss">
@import '../constants';

.assign-node {
    display: flex;
    align-items: center;
    padding-left: 5px;
    padding-right: 5px;

    .function-label {
        margin-right: 10px;
        pointer-events: none;
    }

    .value-select {
        margin-right: 5px;
    }
}
</style>
