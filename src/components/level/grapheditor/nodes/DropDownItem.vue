<template>
<li :class="{
	'drop-down-item': true,
	'selected': selected
	}"
  @mousedown="$emit('select-value', value)">
  <i v-if="icon"
    :class="[
				'drop-down-item-icon',
				`icon-${icon}`
			]"
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
  }
}
</script>

<style lang="scss">
@import '../../mixins';

.drop-down-item {
    @include no-select;

    display: flex;
    align-items: center;

    height: 26px;
    min-width: 23px;
    font-size: 18px;
    line-height: 26px;
    font-weight: 400;
    padding: 4px 9px 4px 6px;

    &:nth-child(odd) {
        background-color: transparentize(white, 0.96);
    }
    &:nth-child(even) {
        background-color: transparentize(white, 0.88);
    }

    &.arithmetic-operator,
    &.boolean-operator,
    &.comparison-operator {
        font-weight: 500;
        padding: 4px 9px;
        display: flex;
        justify-content: center;
    }

    &.comparison-operator {
        font-size: 24px;
    }
    &.boolean-operator {
        font-size: 20px;
    }

    i {
        width: 22px;
        height: 22px;
        margin-right: 5px;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
    }
}
</style>
