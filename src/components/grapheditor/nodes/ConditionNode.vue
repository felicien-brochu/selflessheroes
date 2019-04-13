<template>
<li class="node branching-node condition-node">

  <drop-down-button ref="leftExpression"
    :value="expression.leftExpression"
    @drop-down="handleDropDownLeftExpression"
    @edit-position="handleEditLeftPosition"
    @edit-integer="handleEditLeftInteger" />
  <drop-down-button ref="operator"
    :value="expression.operator"
    :label="comparisonOperator"
    @drop-down="handleDropDownOperator" />
  <drop-down-button ref="rightExpression"
    :value="expression.rightExpression"
    @drop-down="handleDropDownRightExpression"
    @edit-position="handleEditRightPosition"
    @edit-integer="handleEditRightInteger" />

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
import IntegerLiteral from '../../../world/ai/compile/statements/literals/IntegerLiteral'

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

    handleEditLeftPosition(e) {
      this.openDirectionPopup(
        this.expression.leftExpression,
        this.$refs.leftExpression,
        this.handleSelectLeftDirection)
    },

    handleEditRightPosition(e) {
      this.openDirectionPopup(
        this.expression.rightExpression,
        this.$refs.rightExpression,
        this.handleSelectRightDirection)
    },

    handleEditRightInteger(e) {
      this.openIntegerPopup(
        this.expression.rightExpression,
        this.$refs.rightExpression,
        this.handleSelectRightInteger)
    },
    handleEditLeftInteger(e) {
      this.openIntegerPopup(
        this.expression.leftExpression,
        this.$refs.leftExpression,
        this.handleSelectLeftInteger)
    },


    setLeftExpressionValue(value) {
      if (value === DirectionLiteral) {
        let direction = null
        if (this.expression.leftExpression instanceof DirectionLiteral) {
          direction = this.expression.leftExpression
        }
        this.openDirectionPopup(
          direction,
          this.$refs.leftExpression,
          this.handleSelectLeftDirection)
      }
      else if (value === IntegerLiteral) {
        let integer = null
        if (this.expression.leftExpression instanceof IntegerLiteral) {
          integer = this.expression.leftExpression
        }
        this.openIntegerPopup(
          integer,
          this.$refs.leftExpression,
          this.handleSelectLeftInteger)
      }
      else {
        value.parent = this.expression
        this.expression.leftExpression = value
      }
    },
    handleSelectLeftDirection(directions) {
      if (directions.length >= 1) {
        let value = directions[0]
        value.parent = this.expression
        this.expression.leftExpression = value
      }
    },

    setRightExpressionValue(value) {
      if (value === DirectionLiteral) {
        let direction = null
        if (this.expression.rightExpression instanceof DirectionLiteral) {
          direction = this.expression.rightExpression
        }
        this.openDirectionPopup(
          direction,
          this.$refs.rightExpression,
          this.handleSelectRightDirection)
      }
      else if (value === IntegerLiteral) {
        let integer = null
        if (this.expression.rightExpression instanceof IntegerLiteral) {
          integer = this.expression.rightExpression
        }
        this.openIntegerPopup(
          integer,
          this.$refs.rightExpression,
          this.handleSelectRightInteger)
      }
      else {
        value.parent = this.expression
        this.expression.rightExpression = value
      }
    },
    handleSelectRightDirection(directions) {
      if (directions.length >= 1) {
        let value = directions[0]
        value.parent = this.expression
        this.expression.rightExpression = value
      }
    },
    handleSelectLeftInteger(integerLiteral) {
      if (integerLiteral) {
        integerLiteral.parent = this.expression
        this.expression.leftExpression = integerLiteral
      }
    },
    handleSelectRightInteger(integerLiteral) {
      if (integerLiteral) {
        integerLiteral.parent = this.expression
        this.expression.rightExpression = integerLiteral
      }
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
    },

    openIntegerPopup(integer, anchorComp, onSelectValue) {
      let integerPopup = this.popupLayer.createIntegerPopup({
        anchor: anchorComp.$el,
        integer: integer
      })
      integerPopup.$on('select-value', onSelectValue)
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
