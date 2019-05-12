<template>
<li :class="{
	'palette-statement': true,
	'place-holder': placeHolder,
	'assign-statement': isAssignStatement,
	'action-statement': isActionStatement,
	'branching-statement': isBranchingStatement
}"
  @mousedown="handleMouseDown"
  @touchstart="handleMouseDown">{{label}}</li>
</template>

<script>
import {
  assignStatementType,
  actionStatementType,
  branchingStatementType
}
from './PaletteStatementType'

export default {
  components: {},
  props: {
    'statement': {
      type: Object,
      default: null
    },
    'placeHolder': {
      type: Boolean,
      default: false
    }
  },
  computed: {
    label: function() {
      if (this.isBranchingStatement) {
        return this.$text(`graph_node_${this.statement.keyword}`)
      }
      else {
        return this.$text(`graph_node_function_${this.statement.keyword}`)
      }
    },
    isAssignStatement: function() {
      return this.isOfType(assignStatementType)
    },
    isActionStatement: function() {
      return this.isOfType(actionStatementType)
    },
    isBranchingStatement: function() {
      return this.isOfType(branchingStatementType)
    },
  },
  methods: {
    isOfType(type) {
      return this.statement.statementType === type
    },
    handleMouseDown(e) {
      this.$emit('drag-start', {
        event: e,
        statement: this.statement
      })
    }
  }
}
</script>

<style lang="scss">
@import '../mixins';

.palette-statement {
    @extend %node;
    transition-property: padding, border-width;
    transition-duration: 0.07s;
}

.place-holder {
    background: none !important;
    padding: 0 16px 0 6px;
    height: $node-line-height - 6px;
    border: 3px dashed rgba(#abb2bf, 0.3);
    color: #282c34 !important;
    transition-property: none;
    box-shadow: none;
}
.assign-statement {
    @include node-color($assign-color);
}
.action-statement {
    @include node-color($action-color);
}
.branching-statement {
    @include node-color($branching-color);
}
</style>
