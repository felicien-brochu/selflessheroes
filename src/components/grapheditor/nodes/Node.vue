<template>
<div class="node">
</div>
</template>

<script>
export default {
  props: {
    'statement': {
      type: Object,
      default: null
    },
    'compilerConfig': {
      type: Object,
      default: null
    }
  },
  methods: {
    handleDragStart(e) {
      this.$emit('drag-start', {
        event: e,
        node: this
      })
    }
  }
}
</script>

<style lang="scss">
@import '../constants';

.node {
    @extend %node;
}

.assign-node {
    @include node-color($assign-color);
}
.action-node {
    @include node-color($action-color);
}
.branching-node {
    @include node-color($branching-color);
}
</style>
