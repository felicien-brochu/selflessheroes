<template>
<li class="node action-node"
  @mousedown="handleDragStart"
  @touchstart="handleDragStart">

  <div class="function-label">
    {{$text(`graph_node_function_${statement.constructor.keyword}`)}}
  </div>

  <value-select v-for="(param, index) in params"
    ref="valueSelects"
    :key="index"
    :types="param.types"
    :value="param.value"
    parentType="action"
    @select="handleSelectParam(index, $event)"
    @start-edit="$emit('start-edit')" />

</li>
</template>

<script>
import DirectionLiteral from '../../../../world/ai/compile/statements/literals/DirectionLiteral'
import IntegerLiteral from '../../../../world/ai/compile/statements/literals/IntegerLiteral'
import Node from './Node'
import ValueSelect from './ValueSelect'
import FunctionMixin from './FunctionMixin'

export default {
  components: {
    ValueSelect
  },
  extends: Node,
  mixins: [FunctionMixin],
  data: function() {
    return {
      func: this.statement,
      autoPopSelectDone: false
    }
  },

  computed: {
    autoPopSelect: function() {
      if (this.params.length === 1) {
        let param = this.params[0]
        // If the types possible are only integer literal or direction
        if (param.types.length === 1 &&
          (param.types[0].type === DirectionLiteral || param.types[0].type === IntegerLiteral)) {
          return true
        }
      }
      return false
    }
  },

  mounted() {
    if (this.autoPopSelect && this.inserted && !this.autoPopSelectDone) {
      this.autoPopSelectDone = true
      this.$refs.valueSelects[0].startEdit()
    }
  }
}
</script>

<style lang="scss">
@import '../../mixins';

.action-node {
    @include node-color($action-color);
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
