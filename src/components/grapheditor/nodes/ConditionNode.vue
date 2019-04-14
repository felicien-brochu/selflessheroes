<template>
<li class="node branching-node condition-node">

  <value-select ref="leftExpression"
    :value="expression.leftExpression"
    :types="leftExpressionTypes"
    @select="handleSelectLeftExpression" />
  <value-select ref="comparisonOperator"
    :value="expression.operator"
    :types="comparisonOperatorTypes"
    :labelFunc="comparisonOperatorLabelFunc"
    @select="handleSelectComparisonOperator" />
  <value-select ref="rightExpression"
    :value="expression.rightExpression"
    :types="rightExpressionTypes"
    @select="handleSelectRightExpression" />

  <div v-if="isFirst"
    class="if-label">
    if
  </div>

</li>
</template>

<script>
import ValueSelect from './ValueSelect'
import {
  comparisonOperators,
  booleanOperators
}
from './operators'

export default {
  components: {
    ValueSelect
  },
  props: {
    'expression': {
      type: Object
    },
    'operator': {
      type: String,
      default: null
    },
    'isFirst': {
      type: Boolean,
      default: false
    },
    'compilerConfig': {
      type: Object
    }
  },
  data: function() {
    return {}
  },
  computed: {
    comparisonOperator: function() {
      return comparisonOperators[this.expression.operator]
    },
    leftExpressionTypes: function() {
      return this.compilerConfig.leftComparisonExpressions
    },
    rightExpressionTypes: function() {
      return this.compilerConfig.rightComparisonExpressions
    },
    comparisonOperatorTypes: function() {
      return ['comparisonOperator']
    }
  },

  methods: {

    handleSelectLeftExpression(value) {
      this.expression.leftExpression = value
    },
    handleSelectRightExpression(value) {
      this.expression.rightExpression = value
    },
    handleSelectComparisonOperator(value) {
      this.expression.operator = value
    },

    comparisonOperatorLabelFunc(operator) {
      return comparisonOperators[operator]
    }
  }
}
</script>

<style lang="scss">
.condition-node {
    position: relative;
    display: flex;
    align-items: center;

    .if-label {
        position: absolute;
        pointer-events: none;
    }

    .value-select {
        margin-left: 5px;
        &:first-child {
            margin-left: 26px;
        }
    }
}
</style>
