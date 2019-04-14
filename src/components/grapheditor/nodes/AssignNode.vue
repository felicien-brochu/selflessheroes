<template>
<li class="node assign-node"
  @mousedown="handleDragStart"
  @touchstart="handleDragStart">

  <value-select :types="variableTypes"
    :value="statement.variable"
    parentType="assign"
    @select="handleSelectVariable" />

  <div class="function-container">

    <div class="assign-arrow" />

    <div class="function-label">
      {{statement.value.keyword}}
    </div>

    <value-select v-for="(param, index) in params"
      :key="index"
      :types="param.types"
      :value="param.value"
      parentType="assign"
      @select="handleSelectParam(index, $event)" />

  </div>

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
    padding-right: 0;
    box-shadow: none;
    // background-color: #6d707a;
    color: darken($assign-color, $text-darken);

    & > .value-select {
        background-color: $assign-color;
        @include node-shadow;
    }

    .assign-arrow {
        width: 0;
        height: 0;
        position: absolute;
        left: -17px;
        border-right: solid 17px $assign-color;
        border-top: solid 17px transparent;
        border-bottom: solid 17px transparent;
    }

    .function-container {
        @include node-color($assign-color);
        @include node-shadow;
        pointer-events: none;
        position: relative;
        padding-right: 5px;
        padding-left: 3px;
        margin-left: 25px;
        display: flex;
        align-items: center;
        border-radius: 0 4px 4px 0;

        .function-label {
            margin-right: 10px;
            pointer-events: none;
        }

        .value-select {
            margin-right: 5px;
            pointer-events: all;
        }
    }
}
</style>
