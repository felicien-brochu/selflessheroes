<template>
<li :class="{
	'drop-down-item': true,
	'selected': selected
	}"
  @mousedown="$emit('select-value', value)">
  <img v-if="icon"
    class="drop-down-item-icon"
    :src="icon"
    :alt="label" />
  <span class="drop-down-item-label">
    {{ label }}
  </span>
</li>
</template>

<script>
export default {
  props: {
    'value': {
      type: [Function, Object, String, Number]
    },
    'selected': {
      type: Boolean,
      default: false
    },
    'label': {
      type: String,
      default: 'item'
    },
    'icon': {
      type: String
    }
  },
  data: function() {
    return {}
  },

  mounted() {

  }
}
</script>

<style lang="scss">
@import '../constants';

.drop-down-item {
    @include no-select;
    display: flex;
    align-items: center;
    color: darken($drop-down-color, 50%);
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    padding: 4px 9px 4px 10px;

    &:nth-child(odd) {
        background-color: $drop-down-color;
        &.selected,
        &:hover {
            background-color: lighten($drop-down-color, 8%);
        }
    }
    &:nth-child(even) {
        background-color: darken($drop-down-color, 3%);
        &.selected,
        &:hover {
            background-color: lighten($drop-down-color, 8%);
        }
    }
}
</style>
