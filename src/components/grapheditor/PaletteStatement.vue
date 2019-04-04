<template>
<li :class="{
	'palette-statement': true,
	'place-holder': placeHolder,
	'assign-statement': isAssignStatement,
	'action-statement': isActionStatement,
	'branching-statement': isBranchingStatement
}"
  @mousedown="handleMouseDown">
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
.palette-statement {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding: 5px 10px 6px 7px;
    border-radius: 5px;
    cursor: grab;
    display: inline;
}

.place-holder {
    background: none !important;
    padding: 3px 8px 4px 5px;
    border: 2px dashed rgba(#abb2bf, 0.3);
    color: #282c34;
}
.assign-statement {
    background-color: #c99d2e;
}
.action-statement {
    background-color: #3f88c5;
}
.branching-statement {
    background-color: #65a83e;
}
</style>
