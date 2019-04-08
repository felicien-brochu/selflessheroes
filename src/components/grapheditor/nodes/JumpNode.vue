<template>
<li class="node branching-node jump-node"
  @mousedown="handleDragStart">
  {{statement.keyword}}
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

</style>
