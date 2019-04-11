<template>
<li class="node branching-node condition-node">
  {{ isFirst ? "if" : ""}} {{this.expression.code.join(' ')}}
</li>
</template>

<script>
export default {
  props: {
    'expression': {
      type: Object
    },
    'operator': {
      type: String,
      default: null
    },
    'isFirst': {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {}
  }
}
</script>

<style lang="scss">

</style>
