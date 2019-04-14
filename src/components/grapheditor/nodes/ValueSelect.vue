<template>
<div :class="{
	'value-select': true,
	'no-background': isDirection
	}">

  <div class="label-container">
    <direction-value v-if="isDirection"
      :values="[value]"
      @click="handleEditPosition" />
    <div v-else-if="isInteger"
      class="label"
      @mousedown="handleEditInteger"
      @touchstart="handleEditInteger">
      {{label}}
    </div>
    <div v-else
      class="label"
      @mousedown="handleDropDown"
      @touchstart="handleDropDown">
      {{label}}
    </div>
  </div>
  <div class="button-icon"
    @mousedown="handleDropDown"
    @touchstart="handleDropDown">⯆</div>

</div>
</template>

<script>
import DirectionValue from './DirectionValue'
import VariableIdentifier from '../../../world/ai/compile/statements/VariableIdentifier'
import ObjectTypeLiteral from '../../../world/ai/compile/statements/literals/ObjectTypeLiteral'
import TerrainTypeLiteral from '../../../world/ai/compile/statements/literals/TerrainTypeLiteral'
import DirectionLiteral from '../../../world/ai/compile/statements/literals/DirectionLiteral'
import IntegerLiteral from '../../../world/ai/compile/statements/literals/IntegerLiteral'
import ObjectType from '../../../world/ObjectType'
import TerrainType from '../../../world/TerrainType'


export default {
  components: {
    DirectionValue
  },
  props: {
    'value': {
      type: [Object, String]
    },
    'types': {
      type: Array
    },
    'labelFunc': {
      type: Function
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
      return this.value instanceof DirectionLiteral
    },
    isInteger: function() {
      return this.value instanceof IntegerLiteral
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
      this.openDropDownList()
    },

    handleEditPosition(e) {
      this.openDirectionPopup()
    },

    handleEditInteger(e) {
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
      if (directions.length >= 1) {
        let direction = directions[0]
        this.setValue(direction)
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
        types: this.types,
        value: this.value
      })
      dropDownList.$on('select-value', this.handleSelectDropDownItem)
    },

    openDirectionPopup() {
      let directions = []
      if (this.value instanceof DirectionLiteral) {
        directions = [this.value]
      }
      let directionPopup = this.popupLayer.createDirectionPopup({
        anchor: this.$el,
        directions: directions,
        multiple: false
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
        integer: integer
      })
      integerPopup.$on('select-value', this.handleSelectInteger)
    }
  }
}
</script>

<style lang="scss">
.value-select {
    margin-left: 5px;
    align-items: center;
    display: flex;
    background-color: transparentize(white, 0.8);
    color: inherit;
    height: 23px;
    border-radius: 2px;
    cursor: default;

    &.no-background {
        background: none;
    }

    .label-container {
        min-width: 23px;
        .direction-value {}

        .label {
            height: 23px;
            line-height: 23px;
            padding-left: 3px;
            text-align: center;
        }
    }

    .button-icon {
        font-family: Noto;
        text-align: center;
        width: 10px;
        font-size: 11px;
        right: 0;
        padding-left: 3px;
        padding-right: 3px;
    }
}
</style>
