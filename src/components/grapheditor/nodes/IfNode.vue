<template>
<li class="if-node">
  <div class="group-line" />
  <div class="if-content">
    <ul class="condition-list">
      <li class="node branching-node condition-node"
        @mousedown="handleDragStart">
        if
      </li>
    </ul>
    <ul class="node-container"
      ref="nodeContainer">
    </ul>

    <div v-if="statements.length > 1"
      class="else-content">
      <div class="node branching-node"
        @mousedown="handleDragStart">
        else
      </div>
      <ul class="node-container"
        ref="elseNodeContainer">
      </ul>
    </div>
  </div>
</li>
</template>

<script>
import ContainerNode from './ContainerNode'
import NodeBuilder from './NodeBuilder'

export default {
  extends: ContainerNode,
  data: function() {
    return {
      nodes: [
        []
      ]
    }
  },
  mounted() {
    for (let i = 0; i < this.statements.length; i++) {
      this.populateNodeContainer(i)
    }
  },
  watch: {
    statements: function(statements) {
      for (let i = 0; i < this.statements.length; i++) {
        this.clearNodeContainer(i)
        this.populateNodeContainer(i)
      }
    }
  },
  methods: {
    clearNodeContainer(index) {
      let container = this.getNodeContainer(index)
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    },
    populateNodeContainer(index) {
      let nodeBuilder = new NodeBuilder(this.statements[index])
      let nodes = nodeBuilder.build(this.compilerConfig)
      this.nodes[index] = nodes
      let container = this.getNodeContainer(index)
      for (let node of nodes) {
        container.appendChild(node.$el)
        node.$on('drag-start', this.handleNodeDragStart)
        node.$on('node-drag-start', this.handleNodeDragStart)
      }
    },
    getNodeContainer(index) {
      if (index === 0) {
        return this.$refs.nodeContainer
      }
      else if (index === 1) {
        return this.$refs.elseNodeContainer
      }
      return null
    },
    handleNodeDragStart(e) {
      this.$emit('node-drag-start', e)
    }
  }
}
</script>

<style lang="scss">
@import '../constants';

.group-line {
    position: absolute;
    z-index: -1;
    height: auto;
    width: 4px;
    background-color: transparentize($branching-color, 0.7);
    left: 3px;
    top: 0;
    bottom: -3px;
}

.if-node {
    position: relative;
}

.if-content {
    @extend %node-list;

    .condition-list {
        @extend %node-list;
        margin-bottom: $line-margin;
    }
}

.else-content {
    @extend %node-list;

    margin-top: $line-margin;

    & > .node-container {
        margin-top: $line-margin;
    }
}
</style>
