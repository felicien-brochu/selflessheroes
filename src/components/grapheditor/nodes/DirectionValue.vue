<template>
<table class="direction-values">
  <tr>
    <td :class="{'selected': directions.includes('nw')}" />
    <td :class="{'selected': directions.includes('n')}" />
    <td :class="{'selected': directions.includes('ne')}" />
  </tr>
  <tr>
    <td :class="{'selected': directions.includes('w')}" />
    <td :class="{'selected': directions.includes('here')}" />
    <td :class="{'selected': directions.includes('e')}" />
  </tr>
  <tr>
    <td :class="{'selected': directions.includes('sw')}" />
    <td :class="{'selected': directions.includes('s')}" />
    <td :class="{'selected': directions.includes('se')}" />
  </tr>
</table>
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
    border-collapse: separate;
    border-spacing: 1px;
    tr {
        td {
            width: 7px;
            height: 7px;
            padding: 0;
            border-radius: 1px;
            background-color: transparentize(white, 0.7);

            &.selected {
                background: transparentize(white, 0.4);
            }
        }
    }
}
</style>
