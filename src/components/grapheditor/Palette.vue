<template>
<ul class="palette">
  <palette-statement v-for="statement in statements"
    :statement="statement"
    :key="statement.keyword"
    :placeHolder="chosenStatement && statement.keyword === chosenStatement.keyword"
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

import IfStatement from '../../world/ai/compile/statements/IfStatement'
import JumpStatement from '../../world/ai/compile/statements/JumpStatement'
import StepFunction from '../../world/ai/compile/statements/functions/StepFunction'
import DirFunction from '../../world/ai/compile/statements/functions/DirFunction'

const branchingStatements = [
  IfStatement,
  JumpStatement
]
const actionFunctions = [
  StepFunction
]
const assignFunctions = [
  DirFunction
]
const paletteStatements = [
  ...branchingStatements,
  ...assignFunctions,
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

      let primaryStatements = [...this.compilerConfig.getPrimaryStatements(), ...this.compilerConfig.valueFunctions]
      let statementClasses = primaryStatements.filter(statementClass => paletteStatements.indexOf(statementClass) >= 0)
      let statements = statementClasses.map(statementClass => {
        return {
          keyword: (new statementClass()).keyword,
          clazz: statementClass
        }
      })
      let assign = statementClasses.filter(statementClass => assignFunctions.indexOf(statementClass) >= 0)
      let actions = statementClasses.filter(statementClass => actionFunctions.indexOf(statementClass) >= 0)
      let branching = statementClasses.filter(statementClass => branchingStatements.indexOf(statementClass) >= 0)
      assign = assign.map(statementClass => {
        return {
          statementType: assignStatementType,
          keyword: (new statementClass()).keyword,
          clazz: statementClass
        }
      })
      actions = actions.map(statementClass => {
        return {
          statementType: actionStatementType,
          keyword: (new statementClass()).keyword,
          clazz: statementClass
        }
      })
      branching = branching.map(statementClass => {
        return {
          statementType: branchingStatementType,
          keyword: (new statementClass()).keyword,
          clazz: statementClass
        }
      })

      return [
        ...assign,
        ...actions,
        ...branching
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
    padding: 7px 20px 30px 15px;
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;
    background-color: #282c34;
    border: solid 2px rgb(75, 82, 97);
    border-right: none;
    list-style: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .palette-statement {
        margin-top: 8px;
    }
}
</style>
