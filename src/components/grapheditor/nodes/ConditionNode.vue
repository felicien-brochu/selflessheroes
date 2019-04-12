<template>
<li class="node branching-node condition-node">
  <div v-if="isFirst"
    class="if-label">
    if
  </div>

  <drop-down-button ref="leftExpression"
    :value="expression.leftExpression"
    @click="handleClickLeftExpression" />
  <drop-down-button ref="operator"
    :value="expression.operator"
    @click="handleClickOperator" />
  <drop-down-button ref="rightExpression"
    :value="expression.rightExpression"
    @click="handleClickRightExpression" />

</li>
</template>

<script>
import DropDownButton from './DropDownButton'
import {
  createDropDownList
}
from './DropDownList'

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

    setLeftExpressionValue(value) {
      this.expression.leftExpression = value
    },
    setRightExpressionValue(value) {
      this.expression.rightExpression = value
    },

    openDropDownList(types, value, anchorComp, onSelectValue) {
      let dropDownList = this.dropDownLayer.createDropDownList({
        anchor: anchorComp.$el,
        types: types,
        value: value
      })
      dropDownList.$on('select-value', onSelectValue)
    },

    handleClickOperator(e) {},
  }
}
</script>

<style lang="scss">
.condition-node {
    display: flex;
    align-items: center;

    .if-label {
        pointer-events: none;
    }

    .drop-down-button {
        margin-right: 5px;
    }
}
</style>
