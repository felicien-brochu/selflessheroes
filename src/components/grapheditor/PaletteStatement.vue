<template>
<li :class="{
	'palette-statement': true,
	'place-holder': placeHolder,
	'assign-statement': isAssignStatement,
	'action-statement': isActionStatement,
	'branching-statement': isBranchingStatement
}"
  @mousedown="handleMouseDown"
  @touchstart="handleMouseDown">
  {{statement.keyword}}
</li>
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
@import 'constants';

.palette-statement {
    @extend %node;

    transition-property: padding, border-width;
    transition-duration: 0.1s;
}

.place-holder {
    background: none !important;
    padding: $node-padding-top - 3px $node-padding-right - 3px $node-padding-bottom - 3px $node-padding-left - 3px;
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
