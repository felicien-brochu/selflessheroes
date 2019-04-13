<template>
<li class="node branching-node condition-node">

  <drop-down-button ref="leftExpression"
    :value="expression.leftExpression"
    @drop-down="handleDropDownLeftExpression"
    @edit-position="handleEditLeftPosition" />
  <drop-down-button ref="operator"
    :value="expression.operator"
    :label="comparisonOperator"
    @drop-down="handleDropDownOperator" />
  <drop-down-button ref="rightExpression"
    :value="expression.rightExpression"
    @drop-down="handleDropDownRightExpression" />

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
import DirectionLiteral from '../../../world/ai/compile/statements/literals/DirectionLiteral'

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
    this.popupLayer = document.getElementById("popup-layer").__vue__
  },

  beforeDestroy() {},

  methods: {

    handleDropDownLeftExpression(e) {
      this.openDropDownList(
        this.compilerConfig.leftComparisonExpressions,
        this.expression.leftExpression,
        this.$refs.leftExpression,
        this.setLeftExpressionValue
      )
    },

    handleEditLeftPosition(e) {
      console.log("####EDIT")
      this.openDirectionPopup(
        this.expression.leftExpression,
        this.$refs.leftExpression,
        this.handleSelectLeftDirection)
    },

    handleDropDownRightExpression(e) {
      this.openDropDownList(
        this.compilerConfig.rightComparisonExpressions,
        this.expression.rightExpression,
        this.$refs.rightExpression,
        this.setRightExpressionValue
      )
    },

    handleDropDownOperator(e) {
      this.openDropDownList(
        ['comparisonOperator'],
        this.expression.operator,
        this.$refs.operator,
        this.setOperatorValue
      )
    },

    setLeftExpressionValue(value) {
      if (value === DirectionLiteral) {
        this.openDirectionPopup(
          null,
          this.$refs.leftExpression,
          this.handleSelectLeftDirection)
      }
      else {
        this.expression.leftExpression = value
      }
    },

    handleSelectLeftDirection(directions) {
      console.log("######handleSelectLeftDirection", directions)
      this.expression.leftExpression = directions[0]
    },

    setRightExpressionValue(value) {
      this.expression.rightExpression = value
    },
    setOperatorValue(value) {
      this.expression.operator = value
    },

    openDropDownList(types, value, anchorComp, onSelectValue) {
      let dropDownList = this.popupLayer.createDropDownList({
        anchor: anchorComp.$el,
        types: types,
        value: value
      })
      dropDownList.$on('select-value', onSelectValue)
    },

    openDirectionPopup(direction, anchorComp, onSelectValue) {
      let directionPopup = this.popupLayer.createDirectionPopup({
        anchor: anchorComp.$el,
        directions: direction ? [direction] : [],
        multiple: false
      })
      directionPopup.$on('select-value', onSelectValue)
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
