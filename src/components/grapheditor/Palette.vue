<template>
<ul class="palette">
  <li v-for="statement in statements">
    {{ statement.keyword }}
  </li>
</ul>
</template>

<script>
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
  components: {},
  props: {
    'compilerConfig': {
      type: Object,
      default: null
    }
  },
  data: function() {
    return {
      statementClasses: []
    }
  },
  mounted: function() {},
  watch: {
    compilerConfig: function(config, oldConfig) {
      if (!config) {
        return
      }

      let primaryStatements = [...config.getPrimaryStatements(), ...config.assignValueFunctions]
      this.statementClasses = primaryStatements.filter(statementClass => paletteStatements.indexOf(statementClass) >= 0)
      console.log(this.statements)
    }
  },
  computed: {
    statements: function() {
      return this.statementClasses.map(statementClass => {
        return {
          keyword: (new statementClass()).keyword,
          clazz: statementClass
        }
      })
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
.palette {
    width: 80px;
    padding: 10px 20px;
    background-color: white;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    background-color: #282c34;
    border: solid 2px rgb(75, 82, 97);
    border-right: none;
    list-style: none;
}
</style>
