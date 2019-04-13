<template>
<table class="direction-value">
  <tr>
    <td ref="nw"
      :class="{'selected': directions.includes('nw')}" />
    <td ref="n"
      :class="{'selected': directions.includes('n')}" />
    <td ref="ne"
      :class="{'selected': directions.includes('ne')}" />
  </tr>
  <tr>
    <td ref="w"
      :class="{'selected': directions.includes('w')}" />
    <td ref="here"
      :class="{'selected': directions.includes('here')}" />
    <td ref="e"
      :class="{'selected': directions.includes('e')}" />
  </tr>
  <tr>
    <td ref="sw"
      :class="{'selected': directions.includes('sw')}" />
    <td ref="s"
      :class="{'selected': directions.includes('s')}" />
    <td ref="se"
      :class="{'selected': directions.includes('se')}" />
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

.direction-value {
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
                background: transparentize(white, 0.3);
            }
        }
    }
}
</style>
