<template>
<li class="if-node">
  <div class="group-line" />
  <div class="if-content">
    <ul class="condition-list">
      <li class="node branching-node condition-node">
        {{statement.keyword}}
      </li>
    </ul>
    <ul class="node-container"
      ref="nodeContainer">
    </ul>
  </div>
</li>
</template>

<script>
import ContainerNode from './ContainerNode'

export default {
  extends: ContainerNode,
  data: function() {
    return {
      nodes: []
    }
  }
}
</script>

<style lang="scss">
@import '../constants';

.if-node {
    position: relative;

    & + *:not(.else-node) {
        margin-top: $line-margin;
    }
}

.if-content {
    @extend %node-list;
    padding-bottom: 3px;

    .condition-list {
        @extend %node-list;
        margin-bottom: $line-margin - 3px;
    }
}
</style>
