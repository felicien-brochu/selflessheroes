<template>
<li class="node branching-node condition-node">

  <drop-down-button ref="leftExpression"
    :value="expression.leftExpression"
    @click="handleClickLeftExpression" />
  <drop-down-button ref="operator"
    :value="expression.operator"
    :label="comparisonOperator"
    @click="handleClickOperator" />
  <drop-down-button ref="rightExpression"
    :value="expression.rightExpression"
    @click="handleClickRightExpression" />

  <div v-if="isFirst"
    class="if-label">
    if
  </div>

</li>
</template>

<script>
import DropDownButton from './DropDownButton'
import {
  createDropDownList
}
from './DropDownList'
import {
  comparisonOperators,
  booleanOperators
}
from './operators'

export default {
  components: {
    DropDownButton
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
    }
  },

  mounted() {
    this.dropDownList = null
    this.dropDownLayer = document.getElementById("drop-down-layer").__vue__
  },

  beforeDestroy() {},

  methods: {

    handleClickLeftExpression(e) {
      this.openDropDownList(
        this.compilerConfig.leftComparisonExpressions,
        this.expression.leftExpression,
        this.$refs.leftExpression,
        this.setLeftExpressionValue
      )
    },

    handleClickRightExpression(e) {
      this.openDropDownList(
        this.compilerConfig.rightComparisonExpressions,
        this.expression.rightExpression,
        this.$refs.rightExpression,
        this.setRightExpressionValue
      )
    },

    handleClickOperator(e) {
      this.openDropDownList(
        ['comparisonOperator'],
        this.expression.operator,
        this.$refs.operator,
        this.setOperatorValue
      )
    },

    setLeftExpressionValue(value) {
      this.expression.leftExpression = value
    },
    setRightExpressionValue(value) {
      this.expression.rightExpression = value
    },
    setOperatorValue(value) {
      this.expression.operator = value
    },

    openDropDownList(types, value, anchorComp, onSelectValue) {
      let dropDownList = this.dropDownLayer.createDropDownList({
        anchor: anchorComp.$el,
        types: types,
        value: value
      })
      dropDownList.$on('select-value', onSelectValue)
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

    .drop-down-button {

        margin-left: 5px;
        &:first-child {
            margin-left: 20px;
        }
    }
}
</style>
