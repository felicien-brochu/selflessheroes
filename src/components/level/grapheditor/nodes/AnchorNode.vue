<template>
<li class="node branching-node anchor-node"
  @mousedown="handleDragStart"
  @touchstart="handleDragStart">
  &nbsp;
</li>
</template>

<script>
import Node from './Node'

export default {
  extends: Node,
  props: {},
  data: function() {
    return {}
  }
}
</script>

<style lang="scss">
.anchor-node {
    width: 30px;
}
</style>
