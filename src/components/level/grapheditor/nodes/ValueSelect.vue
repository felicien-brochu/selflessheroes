<template>
<button :class="{
	'value-select': true,
	'no-background': isDirection
	}"
  @mousedown="handleClickContainer"
  @touchstart="handleClickContainer">

  <div ref="labelContainer"
    class="label-container">
    <direction-value v-if="isDirection"
      :value="value"
      :notHere="directionNotHere"
      @mousedown.native="handleEditPosition"
      @touchstart.native="handleEditPosition" />
    <div v-else-if="isInteger"
      class="label"
      @mousedown="handleEditInteger"
      @touchstart="handleEditInteger">
      <div class="label-text">{{label}}</div>
    </div>
    <div v-else
      class="label"
      @mousedown="handleDropDown"
      @touchstart="handleDropDown"><i v-if="icon.length > 0"
        :class="`icon-${icon}`" />
      <div class="label-text">{{label}}</div>
    </div>
  </div>
  <i v-if="hasDropDown"
    class="button-icon mdi mdi-menu-down" />

</button>
</template>

<script>
import DirectionValue from './DirectionValue'
import VariableIdentifier from '../../../../world/ai/compile/statements/VariableIdentifier'
import ObjectTypeLiteral from '../../../../world/ai/compile/statements/literals/ObjectTypeLiteral'
import TerrainTypeLiteral from '../../../../world/ai/compile/statements/literals/TerrainTypeLiteral'
import DirectionLiteral from '../../../../world/ai/compile/statements/literals/DirectionLiteral'
import IntegerLiteral from '../../../../world/ai/compile/statements/literals/IntegerLiteral'
import ArithmeticOperatorLiteral from '../../../../world/ai/compile/statements/literals/ArithmeticOperatorLiteral'
import ObjectType from '../../../../world/ObjectType'
import TerrainType from '../../../../world/TerrainType'
import {
  arithmeticOperators
}
from './operators'


export default {
  components: {
    DirectionValue
  },
  props: {
    'value': {
      type: [Object, String, Array]
    },
    'types': {
      type: Array
    },
    'labelFunc': {
      type: Function
    },
    'parentType': {
      type: String,
      validator: value => {
        return ['branching', 'action', 'assign'].includes(value)
      },
      default: 'branching'
    }
  },
  data: function() {
    return {}
  },
  computed: {
    label: function() {
      if (this.labelFunc) {
        return this.labelFunc(this.value)
      }
      else if (this.value instanceof DirectionLiteral) {
        return this.value.name
      }
      else if (this.value instanceof IntegerLiteral) {
        return this.value.value
      }
      else if (this.value instanceof VariableIdentifier) {
        return this.value.name
      }
      else if (this.value instanceof ObjectTypeLiteral) {
        return this.$text(`drop_down_list_object_type_${this.value.name}`)
      }
      else if (this.value instanceof TerrainTypeLiteral) {
        return this.$text(`drop_down_list_terrain_type_${this.value.name}`)
      }
      else if (this.value instanceof ArithmeticOperatorLiteral) {
        return arithmeticOperators[this.value.operator]
      }
    },
    icon: function() {
      let icon = ''
      if (this.value instanceof VariableIdentifier) {
        icon = 'variable'
      }
      else if (this.value instanceof ObjectTypeLiteral || this.value instanceof TerrainTypeLiteral) {
        icon = this.value.name
      }
      return icon
    },
    isDirection: function() {
      return this.value instanceof DirectionLiteral ||
        (Array.isArray(this.value) && this.value.length >= 1 && this.value[0] instanceof DirectionLiteral) ||
        (this.types.length === 1 && this.types[0].type === DirectionLiteral)
    },
    directionNotHere: function() {
      return (this.value instanceof DirectionLiteral &&
          this.types.some(type => type.type === DirectionLiteral &&
            type.notHere)) ||
        (Array.isArray(this.value) &&
          this.value.length >= 1 &&
          this.value[0] instanceof DirectionLiteral &&
          this.types.some(type => type.type === DirectionLiteral && type.notHere)) ||
        (this.types.length === 1 &&
          this.types[0].type === DirectionLiteral &&
          this.types[0].notHere)
    },
    isInteger: function() {
      return this.value instanceof IntegerLiteral
    },
    hasDropDown: function() {
      return !(this.types.length === 1 && (this.types[0].type === DirectionLiteral || this.types[0].type === IntegerLiteral || this.types[0].type === 'booleanOperator' || this.types[0].type === 'newBooleanOperator'))
    }
  },

  mounted() {
    this.popupLayer = document.getElementById("popup-layer").__vue__
  },

  beforeDestroy() {},

  methods: {

    setValue(value) {
      this.$emit('select', value)
    },

    handleClickContainer(e) {
      let target = e.target
      if (e.touches) {
        target = e.touches[0].target
      }

      let node = target
      while (node.parentNode) {
        if (node && node === this.$refs.labelContainer) {
          return
        }
        if (node === this.$el) {
          break
        }
        node = node.parentNode
      }

      this.handleDropDown(e)
    },

    handleDropDown(e) {
      this.$emit('start-edit')
      this.openDropDownList()
    },

    handleEditPosition(e) {
      this.$emit('start-edit')
      this.openDirectionPopup()
    },

    handleEditInteger(e) {
      this.$emit('start-edit')
      this.openIntegerPopup()
    },

    handleSelectDropDownItem(value) {
      if (value === DirectionLiteral) {
        this.openDirectionPopup()
      }
      else if (value === IntegerLiteral) {
        this.openIntegerPopup()
      }
      else {
        this.setValue(value)
      }
    },

    handleSelectDirection(directions) {
      let directionType = this.types.find(type => type.type === DirectionLiteral)
      if (directionType.multiple) {
        this.setValue(directions)
      }
      else if (directions.length >= 1) {
        this.setValue(directions[0])
      }
    },

    handleSelectInteger(integerLiteral) {
      if (integerLiteral) {
        this.setValue(integerLiteral)
      }
    },

    openDropDownList() {
      this.popupLayer.createDropDownList({
        listener: this.handleSelectDropDownItem,
        anchor: this.$el,
        types: this.types.map(type => type.type),
        value: this.value,
        parentType: this.parentType
      })
    },

    openDirectionPopup() {
      let directions = []
      if (this.isDirection) {
        if (Array.isArray(this.value)) {
          directions = this.value
        }
        else if (this.value) {
          directions = [this.value]
        }
      }
      let directionType = this.types.find(type => type.type === DirectionLiteral)
      this.popupLayer.createDirectionPopup({
        listener: this.handleSelectDirection,
        anchor: this.$el,
        directions: directions,
        multiple: directionType.multiple,
        notHere: directionType.notHere,
        parentType: this.parentType
      })
    },

    openIntegerPopup() {
      let integer = null
      if (this.value instanceof IntegerLiteral) {
        integer = this.value
      }
      this.popupLayer.createIntegerPopup({
        listener: this.handleSelectInteger,
        anchor: this.$el,
        integer: integer,
        parentType: this.parentType
      })
    }
  }
}
</script>

<style lang="scss">
@import '../../mixins';

.value-select {
    align-items: center;
    display: flex;

    @include node-button;
    color: inherit;
    height: 26px;
    line-height: 1;
    font-size: 20px;
    font-weight: 400;
    cursor: default;

    &.dark {
        background: none;

        &:hover {
            background-color: transparentize(black, 0.94);
        }
        &:active {
            background-color: transparentize(black, 0.90);
        }

        .label-container {
            .label {
                padding: 0;
            }
        }
    }

    &.bright {
        background-color: transparentize(white, 0.8);
        &:active {
            background-color: transparentize(white, 0.6);
        }
    }

    &.no-background {
        background: none;
    }

    .label-container {
        min-width: 23px;

        .label {
            padding-left: 5px;
            height: 26px;
            display: flex;
            align-items: center;

            .label-text {
                text-align: center;
                flex-grow: 1;
            }

            i {
                width: 22px;
                height: 22px;
                margin-right: 5px;
                display: inline-block;
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
            }
        }
    }

    .button-icon {
        text-align: center;
        width: 13px;
        font-size: 22px;
        padding-right: 6px;
        margin-left: -3px;
    }
}
</style>
