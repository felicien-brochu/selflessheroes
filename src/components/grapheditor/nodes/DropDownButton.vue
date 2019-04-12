<template>
<div class="drop-down-button"
  @mousedown="$emit('click', $event)">
  <span class="drop-down-label">
    {{label}}
  </span>
  <svg class="button-icon"
    x="0px"
    y="0px"
    viewBox="0 0 8 5">
    <path id="shape-arrow"
      d="M 0 0 L 8 0 L 4 5 z" />

  </svg>
</div>
</template>

<script>
export default {
  props: {
    'value': {
      type: [Object, String]
    },
  },
  computed: {
    label: function() {
      return typeof(this.value) == 'string' ? this.value.toString() : ''
    }
  },
  data: function() {
    return {}
  }
}
</script>

<style lang="scss">
.drop-down-button {
    align-items: center;
    justify-content: flex-end;
    display: flex;
    background-color: transparentize(white, 0.8);
    height: 23px;
    min-width: 32px;
    border-radius: 2px;
    padding-left: 3px;
    padding-right: 3px;
    cursor: default;

    .drop-down-label {}

    svg.button-icon {
        width: 10px;
        height: 10px;
        margin-left: 5px;
    }
}
</style>
