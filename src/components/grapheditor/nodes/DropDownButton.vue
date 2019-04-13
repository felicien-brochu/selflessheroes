<template>
<div class="drop-down-button"
  @mousedown="$emit('click', $event)">
  <span class="drop-down-label">
    {{computedLabel}}
  </span>
  <div class="button-icon">⯆</div>
</div>
</template>

<script>
import VariableIdentifier from '../../../world/ai/compile/statements/VariableIdentifier'
import ObjectTypeLiteral from '../../../world/ai/compile/statements/literals/ObjectTypeLiteral'
import TerrainTypeLiteral from '../../../world/ai/compile/statements/literals/TerrainTypeLiteral'
import DirectionLiteral from '../../../world/ai/compile/statements/literals/DirectionLiteral'
import IntegerLiteral from '../../../world/ai/compile/statements/literals/IntegerLiteral'
import ObjectType from '../../../world/ObjectType'
import TerrainType from '../../../world/TerrainType'

export default {
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
    }
  }
}
</script>

<style lang="scss">
.drop-down-button {
    position: relative;
    align-items: center;
    justify-content: center;
    display: flex;
    background-color: transparentize(white, 0.8);
    color: inherit;
    height: 23px;
    min-width: 27px;
    border-radius: 2px;
    padding-left: 3px;
    padding-right: 12px;
    cursor: default;

    .drop-down-label {}

    .button-icon {
        position: absolute;
        font-size: 11px;
        right: 0;
        margin-right: 3px;
    }
}
</style>
