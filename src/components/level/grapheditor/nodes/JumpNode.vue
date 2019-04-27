<template>
<li class="node branching-node jump-node"
  @mousedown="handleDragStart"
  @touchstart="handleDragStart">
  {{$text('type_jump')}}
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
