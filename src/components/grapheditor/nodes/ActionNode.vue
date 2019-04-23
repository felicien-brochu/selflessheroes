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
    parentType="action"
    @select="handleSelectParam(index, $event)"
    @start-edit="$emit('start-edit')" />

</li>
</template>

<script>
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
      func: this.statement
    }
  }
}
</script>

<style lang="scss">
@import '../../constants';

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
