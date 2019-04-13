<template>
<div :class="{
	'drop-down-button': true,
	'no-background': isDirection
	}">
  <div class="button-label">
    <direction-value v-if="isDirection"
      :values="[value]"
      @click="$emit('edit-position', $event)" />
    <div v-else-if="isInteger"
      class="drop-down-label"
      @mousedown="$emit('edit-integer', $event)"
      @touchstart="$emit('edit-integer', $event); $event.preventDefault()">
      {{computedLabel}}
    </div>
    <div v-else
      class="drop-down-label"
      @mousedown="$emit('drop-down', $event)"
      @touchstart="$emit('drop-down', $event); $event.preventDefault()">
      {{computedLabel}}
    </div>
  </div>
  <div class="button-icon"
    @mousedown="$emit('drop-down', $event)"
    @touchstart="$emit('drop-down', $event); $event.preventDefault()">⯆</div>
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
    'label': {
      type: String,
      default: null
    }
  },
  data: function() {
    return {}
  },
  computed: {
    computedLabel: function() {
      if (this.label) {
        return this.label
      }
      if (this.value instanceof DirectionLiteral) {
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

  methods: {
    handleTouchDirectionValue(e) {
      e.preventDefault()
      this.$emit('edit-position', e)
    }
  }
}
</script>

<style lang="scss">
.drop-down-button {
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

    .button-label {
        min-width: 23px;
        .direction-value {}

        .drop-down-label {
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
