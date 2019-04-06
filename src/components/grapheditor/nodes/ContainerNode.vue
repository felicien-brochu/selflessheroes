<template>
<div class="container-node">
  <ul class="node-container"
    </div>
</template>

<script>
import Node from './Node'
import NodeBuilder from './NodeBuilder'

export default {
  extends: Node,
  props: {
    'statements': {
      type: Array,
      default: []
    }
  },
  data: function() {
    return {
      nodes: []
    }
  },

}
</script>

<style lang="scss">
@import '../constants';
</style>
