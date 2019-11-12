<template>
<li class="node branching-node clone-node"
  @mousedown="handleDragStart"
  @touchstart="handleDragStart">

  {{$text('graph_node_clone')}}

  <value-select ref="direction"
    class="bright"
    parentType="branching"
    :value="statement.direction"
    :types="directionType"
    :compilerConfig="compilerConfig"
    @select="handleSelectDirection"
    @start-edit="$emit('start-edit')" />

</li>
</template>

<script>
import Node from './Node'
import CloneStatement from '../../../../world/ai/compile/statements/CloneStatement'
import DirectionLiteral from '../../../../world/ai/compile/statements/literals/DirectionLiteral'
import ValueSelect from './ValueSelect'

export default {
  extends: Node,
  components: {
    ValueSelect
  },
  props: {},
  data: function() {
    return {
      directionType: CloneStatement.getDirectionType(),
      autoPopSelectDone: false
    }
  },
  mounted() {
    if (this.inserted && !this.autoPopSelectDone) {
      this.autoPopSelectDone = true
      this.$refs.direction.startEdit()
    }
  },
  methods: {
    handleSelectDirection(value) {
      this.statement.direction = value
      this.$emit('change')
    },
  }
}
</script>

<style lang="scss">
@import '../../mixins';

.clone-node {
    display: flex;
    align-items: center;
    padding-right: 10px;

    .value-select {
        margin-left: 10px;
    }
}
</style>
