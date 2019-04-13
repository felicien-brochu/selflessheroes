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
  <span class="drop-down-item-label">{{ label }}</span>
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
    color: darken($popup-color, $text-darken);
    min-width: 21px;
    font-size: 18px;
    line-height: 22px;
    font-weight: 500;
    padding: 4px 9px 4px 10px;

    &:nth-child(odd) {
        background-color: lighten($popup-color, 4%);
        &:hover {
            background-color: lighten($popup-color, 12%);
        }
    }
    &:nth-child(even) {
        background-color: lighten($popup-color, 7%);
        &:hover {
            background-color: lighten($popup-color, 10%);
        }
    }
}
</style>
