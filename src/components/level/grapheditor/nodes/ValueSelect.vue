<template>
<button :class="{
	'value-select': true,
	'no-background': isDirection
	}">

  <div class="label-container">
    <direction-value v-if="isDirection"
      :value="value"
      :notHere="directionNotHere"
      @click="handleEditPosition" />
    <div v-else-if="isInteger"
      class="label"
      @mousedown="handleEditInteger"
      @touchstart="handleEditInteger">{{label}}</div>
    <div v-else
      class="label"
      @mousedown="handleDropDown"
      @touchstart="handleDropDown">{{label}}</div>
  </div>
  <div v-if="hasDropDown"
    class="button-icon"
    @mousedown="handleDropDown"
    @touchstart="handleDropDown">⯆</div>

</button>
</template>

<script>
import DirectionValue from './DirectionValue'
import VariableIdentifier from '../../../../world/ai/compile/statements/VariableIdentifier'
import ObjectTypeLiteral from '../../../../world/ai/compile/statements/literals/ObjectTypeLiteral'
import TerrainTypeLiteral from '../../../../world/ai/compile/statements/literals/TerrainTypeLiteral'
import DirectionLiteral from '../../../../world/ai/compile/statements/literals/DirectionLiteral'
import IntegerLiteral from '../../../../world/ai/compile/statements/literals/IntegerLiteral'
import ObjectType from '../../../../world/ObjectType'
import TerrainType from '../../../../world/TerrainType'


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
        return this.value.name
      }
      else if (this.value instanceof TerrainTypeLiteral) {
        return this.value.name
      }
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
      let dropDownList = this.popupLayer.createDropDownList({
        anchor: this.$el,
        types: this.types.map(type => type.type),
        value: this.value,
        parentType: this.parentType
      })
      dropDownList.$on('select-value', this.handleSelectDropDownItem)
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
      let directionPopup = this.popupLayer.createDirectionPopup({
        anchor: this.$el,
        directions: directions,
        multiple: directionType.multiple,
        notHere: directionType.notHere,
        parentType: this.parentType
      })
      directionPopup.$on('select-value', this.handleSelectDirection)
    },

    openIntegerPopup() {
      let integer = null
      if (this.value instanceof IntegerLiteral) {
        integer = this.value
      }
      let integerPopup = this.popupLayer.createIntegerPopup({
        anchor: this.$el,
        integer: integer,
        parentType: this.parentType
      })
      integerPopup.$on('select-value', this.handleSelectInteger)
    }
  }
}
</script>

<style lang="scss">
@import '../../constants';

.value-select {
    align-items: center;
    display: flex;

    @include node-button;
    color: inherit;
    height: 26px;
    line-height: 26px;
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
            text-align: center;
        }
    }

    .button-icon {
        font-family: 'Noto';
        text-align: center;
        width: 10px;
        font-size: 11px;
        right: 0;
        padding-left: 3px;
        padding-right: 3px;
    }
}
</style>
