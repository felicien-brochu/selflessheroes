<template>
<button :class="{
	'value-select': true,
	'no-background': isDirection
	}"
  @mousedown.prevent.stop="handleClickContainer"
  @touchstart.prevent.stop="handleClickContainer">

  <div ref="labelContainer"
    class="label-container">
    <direction-value v-if="isDirection"
      :value="value"
      :notHere="directionNotHere"
      @mousedown.native.prevent.stop="handleEditDirection"
      @touchstart.native.prevent.stop="handleEditDirection" />
    <div v-else-if="isInteger"
      :class="{
				'label': true,
				'number-label': true,
				'no-drop-down': !hasDropDown
			}"
      @mousedown.prevent.stop="handleEditInteger"
      @touchstart.prevent.stop="handleEditInteger">
      <div class="label-text">{{label}}</div>
    </div>
    <div v-else
      :class="{
				'label': true,
				'arithmetic-operator': isArithmeticOperator
			}"
      @mousedown.prevent.stop="handleDropDown"
      @touchstart.prevent.stop="handleDropDown"><i v-if="icon.length > 0"
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
import Direction from '../../../../world/Direction'
import IntegerLiteral from '../../../../world/ai/compile/statements/literals/IntegerLiteral'
import MyItemLiteral from '../../../../world/ai/compile/statements/literals/MyItemLiteral'
import EveryoneLiteral from '../../../../world/ai/compile/statements/literals/EveryoneLiteral'
import MessageLiteral from '../../../../world/ai/compile/statements/literals/MessageLiteral'
import ArithmeticOperatorLiteral from '../../../../world/ai/compile/statements/literals/ArithmeticOperatorLiteral'
import ObjectType from '../../../../world/objects/ObjectType'
import TerrainType from '../../../../world/map/TerrainType'
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
    'compilerConfig': {
      type: Object
    },
    'parentType': {
      type: String,
      validator: value => {
        return ['branching', 'action', 'assign', 'speach'].includes(value)
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
        return this.value.name.substring(1)
      }
      else if (this.value instanceof MyItemLiteral) {
        return this.$text('drop_down_list_my_item_literal')
      }
      else if (this.value instanceof EveryoneLiteral) {
        return this.$text('drop_down_list_everyone_literal')
      }
      else if (this.value instanceof MessageLiteral) {
        return this.$text(`drop_down_list_message_literal_${this.value.message}`)
      }
      else if (this.value instanceof ObjectTypeLiteral) {
        return this.$text(`drop_down_list_object_type_${this.value.name}`)
      }
      else if (this.value instanceof TerrainTypeLiteral) {
        return this.$text(`drop_down_list_terrain_type_${this.value.name}`)
      }
      else if (this.value instanceof ArithmeticOperatorLiteral) {
        return this.$text(arithmeticOperators[this.value.operator])
      }
    },
    icon: function() {
      let icon = ''
      if (this.value instanceof VariableIdentifier) {
        icon = 'variable'
      }
      else if (this.value instanceof MyItemLiteral) {
        icon = 'myitem'
      }
      else if (this.value instanceof EveryoneLiteral) {
        icon = 'everyone'
      }
      else if (this.value instanceof MessageLiteral) {
        icon = `message-${this.value.message}`
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
      let type = null
      if (this.value instanceof DirectionLiteral) {
        type = this.types.find(type => type.type === DirectionLiteral)
      }
      else if (Array.isArray(this.value) &&
        this.value.length >= 1 &&
        this.value[0] instanceof DirectionLiteral) {
        type = this.types.find(type => type.type === DirectionLiteral)
      }
      else if (this.types.length === 1 &&
        this.types[0].type === DirectionLiteral) {
        type = this.types[0]
      }
      else {
        return false
      }

      return typeof type.validator === 'function' && !type.validator(Direction.here)
    },
    isInteger: function() {
      return this.value instanceof IntegerLiteral || (this.types.length === 1 && this.types[0].type === IntegerLiteral)
    },
    isArithmeticOperator: function() {
      return this.value instanceof ArithmeticOperatorLiteral
    },
    hasDropDown: function() {
      let types = this.types
      if (this.compilerConfig.variables === 0) {
        types = types.filter(type => type.type !== VariableIdentifier)
      }

      return !(types.length === 1 && (
        types[0].type === DirectionLiteral ||
        types[0].type === IntegerLiteral ||
        types[0].type === 'booleanOperator' ||
        types[0].type === 'newBooleanOperator'
      ))
    }
  },

  mounted() {
    let popupLayer = document.getElementById("popup-layer")
    if (popupLayer) {
      this.popupLayer = popupLayer.__vue__
    }
  },

  beforeDestroy() {
    this.popupLayer = null
  },

  methods: {

    setValue(value) {
      this.$emit('select', value)
    },

    startEdit() {
      if (this.isInteger) {
        this.editInteger()
      }
      else if (this.isDirection) {
        this.editDirection()
      }
      else {
        this.openDropDownList()
      }
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
      this.openDropDownList()
    },

    handleEditDirection(e) {
      this.editDirection()
    },

    editDirection() {
      this.$emit('start-edit')
      this.openDirectionPopup()
    },

    handleEditInteger(e) {
      e.stopPropagation()
      this.editInteger()
    },

    editInteger() {
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
      this.$emit('start-edit')

      this.popupLayer.createDropDownList({
        listener: this.handleSelectDropDownItem,
        anchor: this.$el,
        types: this.types,
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
        validator: directionType.validator,
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
    font-size: 18px;
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

            &.arithmetic-operator,
            &.number-label {
                font-size: 20px;

                &.no-drop-down {
                    padding-right: 8px;
                    padding-left: 7px;
                }
            }

            .label-text {
                text-align: center;
                flex-grow: 1;
            }

            i {
                width: 20px;
                height: 20px;
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
