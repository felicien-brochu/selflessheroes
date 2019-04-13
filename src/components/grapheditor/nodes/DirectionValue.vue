<template>
<ul class="direction-values"
  @touchstart="$event.preventDefault(); $emit('click', $event)"
  @mousedown="$emit('click', $event)">
  <li :class="{'selected': directions.includes('nw')}" />
  <li :class="{'selected': directions.includes('n')}" />
  <li :class="{'selected': directions.includes('ne')}" />
  <li :class="{'selected': directions.includes('w')}" />
  <li :class="{'selected': directions.includes('here')}" />
  <li :class="{'selected': directions.includes('e')}" />
  <li :class="{'selected': directions.includes('sw')}" />
  <li :class="{'selected': directions.includes('s')}" />
  <li :class="{'selected': directions.includes('se')}" />
</ul>
</template>

<script>
export default {
  props: {
    'values': {
      type: Array,
      default: () => []
    }
  },
  data: function() {
    return {}
  },
  computed: {
    directions: function() {
      return this.values.map(literal => literal.name)
    }
  }
}
</script>

<style lang="scss">
@import '../constants';

.direction-values {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-between;
    width: 23px;
    height: 23px;
    list-style: none;
    padding: 0;
    margin: 0;

    li {
        width: 7px;
        height: 7px;
        padding: 0;
        border-radius: 1px;
        background-color: transparentize(white, 0.75);

        &.selected {
            background: transparentize(white, 0.4);
        }
    }
}
</style>
