<template>
<li class="node assign-node"
  @mousedown="handleDragStart">
  {{ `${statement.variable.name} = ` }}
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
