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
  mounted() {
    let nodeBuilder = new NodeBuilder(this.statements)
    let nodes = nodeBuilder.build(this.compilerConfig)
    this.populateNodeContainer(nodes)
  },
  watch: {
    statements: function(statements) {
      let nodeBuilder = new NodeBuilder(statements)
      let nodes = nodeBuilder.build(this.compilerConfig)
      this.clearNodeContainer()
      this.populateNodeContainer(nodes)
    }
  },
  methods: {
    clearNodeContainer() {
      let container = this.$refs.nodeContainer
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    },
    populateNodeContainer(nodes) {
      this.nodes = nodes
      let container = this.$refs.nodeContainer
      for (let node of nodes) {
        container.appendChild(node.$el)
      }
    }
  }
}
</script>

<style lang="scss">
@import '../constants';

.group-line {
    position: absolute;
    z-index: -1;
    height: 100%;
    width: 4px;
    background-color: transparentize($branching-color, 0.7);
    left: 3px;
}
</style>
