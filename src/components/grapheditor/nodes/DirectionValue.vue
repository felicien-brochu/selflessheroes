<template>
<ul class="direction-values"
  @touchstart="$event.preventDefault(); $emit('click', $event)"
  @mousedown="$emit('click', $event)">
  <li :class="{'selected': directionNames.includes('nw')}" />
  <li :class="{'selected': directionNames.includes('n')}" />
  <li :class="{'selected': directionNames.includes('ne')}" />
  <li :class="{'selected': directionNames.includes('w')}" />
  <li :class="{'selected': directionNames.includes('here'), 'no-value': notHere}" />
  <li :class="{'selected': directionNames.includes('e')}" />
  <li :class="{'selected': directionNames.includes('sw')}" />
  <li :class="{'selected': directionNames.includes('s')}" />
  <li :class="{'selected': directionNames.includes('se')}" />
</ul>
</template>

<script>
import DirectionLiteral from '../../../world/ai/compile/statements/literals/DirectionLiteral'

export default {
  props: {
    'value': {
      type: [Array, Object],
      default: () => []
    },
    'notHere': {
      type: Boolean,
      default: false
    }
  },
  computed: {
    directions: function() {
      let directions = []
      if (this.value instanceof DirectionLiteral) {
        directions = [this.value]
      }
      else if (Array.isArray(this.value)) {
        directions = this.value
      }
      return directions
    },
    directionNames: function() {
      let names = []
      if (this.directions) {
        names = this.directions.map(literal => literal.name)
      }
      return names
    }
  }
}
</script>

<style lang="scss">
@import '../../constants';

.direction-values {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-between;
    width: 26px;
    height: 26px;
    list-style: none;
    padding: 0;
    margin: 0;

    li {
        width: 8px;
        height: 8px;
        padding: 0;
        border-radius: 1px;
        background-color: transparentize(white, 0.75);

        &.selected {
            background: transparentize(white, 0.4);
        }

        &.no-value,
        &.no-value.selected {
            background: none;
        }
    }
}
</style>
