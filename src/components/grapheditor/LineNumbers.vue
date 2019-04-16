<template>
<ol class="line-numbers">
  <li v-for="number in numbers"
    class="line-number">
    {{ number }}
  </li>
</ol>
</template>

<script>
export default {
  props: {
    'numbers': {
      type: Array,
      default: function() {
        return ['1', '2', '3', '4', '5', '6', '7', '8']
      }
    }
  }
}
</script>

<style lang="scss">
@import 'constants';

.line-numbers {
    width: 35px;
    padding: 10px 0 0;
    margin: 0;
    height: min-content;
    background-color: lighten(#282c34, 3%);
    list-style: none;

    li {
        @include no-select;
        text-align: center;
        margin: auto;
        font-weight: bold;
        font-size: 20px;
        color: lighten(#282c34, 10%);
        height: $node-line-height + $line-margin;
        line-height: 33px;
    }
}
</style>
