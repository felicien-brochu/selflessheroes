<template>
<li class="else-node">
  <div class="group-line" />
  <div class="else-content">
    <div class="node branching-node">
      {{statement.keyword}}
    </div>

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
  props: {},
  data: function() {
    return {}
  }
}
</script>

<style lang="scss">
@import '../constants';

.else-node {
    position: relative;
    padding-top: $line-margin - 3px;

    .group-line {
        top: 0;
    }
}

.else-content {
    @extend %node-list;
    padding-bottom: $line-margin / 2;

    & > .node-container {
        margin-top: $line-margin;
    }
}
</style>
