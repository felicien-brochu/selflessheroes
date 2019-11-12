<template>
<ul class="palette">
  <palette-statement v-for="statement in statements"
    :class="{
			'category-last': statement.last
		}"
    :statement="statement"
    :key="statement.clazz.keyword"
    :placeHolder="chosenStatement && statement.clazz.keyword === chosenStatement.clazz.keyword"
    @drag-start="handleDragStart" />
</ul>
</template>

<script>
import PaletteStatement from './PaletteStatement'
import {
  assignStatementType,
  actionStatementType,
  branchingStatementType
}
from './PaletteStatementType'

import IfStatement from '../../../world/ai/compile/statements/IfStatement'
import JumpStatement from '../../../world/ai/compile/statements/JumpStatement'
import CloneStatement from '../../../world/ai/compile/statements/CloneStatement'
import ActionFunctions from '../../../world/ai/compile/statements/functions/ActionFunctions'
import ValueFunctions from '../../../world/ai/compile/statements/functions/ValueFunctions'

const branchingStatements = [
  IfStatement,
  JumpStatement,
  CloneStatement
]
const actionFunctions = Object.values(ActionFunctions)
const valueFunctions = Object.values(ValueFunctions)
const paletteStatements = [
  ...branchingStatements,
  ...valueFunctions,
  ...actionFunctions
]

export default {
  components: {
    PaletteStatement
  },

  props: {
    'compilerConfig': {
      type: Object,
      default: null
    },
    'chosenStatement': {
      type: Object,
      default: null
    }
  },

  data: function() {
    return {
      statementClasses: []
    }
  },

  computed: {
    statements: function() {
      if (!this.compilerConfig) {
        return []
      }

      let primaryStatements = [...this.compilerConfig.getAllowedPrimaryStatements(), ...this.compilerConfig.actionFunctions, ...this.compilerConfig.valueFunctions]
      let statementClasses = primaryStatements.filter(statementClass => paletteStatements.indexOf(statementClass) >= 0)
      let statements = statementClasses.map(statementClass => {
        return {
          clazz: statementClass
        }
      })
      let branching = statementClasses.filter(statementClass => branchingStatements.indexOf(statementClass) >= 0)
      let actions = statementClasses.filter(statementClass => actionFunctions.indexOf(statementClass) >= 0)
      let assign = statementClasses.filter(statementClass => valueFunctions.indexOf(statementClass) >= 0)
      branching = branching.map(statementClass => {
        return {
          statementType: branchingStatementType,
          clazz: statementClass
        }
      })
      actions = actions.map(statementClass => {
        return {
          statementType: actionStatementType,
          clazz: statementClass
        }
      })
      assign = assign.map(statementClass => {
        return {
          statementType: assignStatementType,
          clazz: statementClass
        }
      })

      if (branching.length > 0) {
        branching[branching.length - 1].last = true
      }
      if (actions.length > 0) {
        actions[actions.length - 1].last = true
      }
      if (assign.length > 0) {
        assign[assign.length - 1].last = true
      }

      return [
        ...branching,
        ...actions,
        ...assign
      ]
    }
  },

  methods: {
    handleDragStart(event) {
      this.$emit('drag-start', event)
    }
  }
}
</script>

<style lang="scss">
.palette {
    padding: 7px 20px 20px 15px;
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;
    background-color: #282c34;
    border: solid 2px rgb(75, 82, 97);
    border-right: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .palette-statement {
        margin-top: 8px;

        &.category-last {
            margin-bottom: 10px;
        }
    }
}
</style>
