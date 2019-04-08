<template>
<li class="if-node">
  <div v-if="statements[0].length > 0 || (statements.length > 1 && statements[1].length > 0)"
    class="group-line" />
  <div class="if-content">
    <ul class="condition-list"
      ref="conditionList">
      <li class="node branching-node condition-node"
        @mousedown="handleDragStart">
        if
      </li>
    </ul>
    <ul class="node-container"
      ref="nodeContainer">
    </ul>

    <div v-if="statements.length >= 2 || draggedOver"
      class="else-content">
      <div class="node branching-node"
        ref="elseNode"
        @mousedown="handleDragStart">
        else
      </div>
      <ul :class="{
				'node-container': true,
				'dragged-over': draggedOver
				}"
        ref="elseNodeContainer">
      </ul>
    </div>
  </div>
</li>
</template>

<script>
import Node from './Node'
import NodeBuilder from './NodeBuilder'

export default {
  extends: Node,
  props: {
    'statements': {
      type: Array,
      default: () => [
        []
      ]
    }
  },
  data: function() {
    return {
      nodes: [
        []
      ],
      draggedOver: false
    }
  },
  mounted() {
    this.dragOverIndex = -1
    this.dragTransitionStart = -1

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
  computed: {
    dragNodes: function() {
      let mapping = node => {
        return {
          node: node,
          el: node.$el,
          draggable: node.getDraggableElement()
        }
      }
      let nodes = this.nodes[0].map(mapping)
      if (this.nodes.length > 1) {
        // Insert else node
        nodes.push({
          node: null,
          el: this.$refs.elseNode,
          draggable: this.$refs.elseNode
        })
        nodes = nodes.concat(this.nodes[1].map(mapping))
      }
      return nodes
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

    handleDragOver(event) {
      let bounds = this.$el.getBoundingClientRect()
      if (event.y + event.height >= bounds.top && event.y <= bounds.top + bounds.height) {
        this.draggedOver = true
        let nodes = this.dragNodes
        let handled = false

        let above = -1
        let bellow = -1
        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i]
          let nodeBox = node.draggable.getBoundingClientRect()
          if (!!node.node) {
            handled = node.node.handleDragOver(event)
          }
          if (event.y + event.height >= nodeBox.top + 21) {
            bellow = i
          }
          if (event.y <= nodeBox.top + nodeBox.height - 2) {
            if (above < 0) {
              above = i
            }
          }
        }

        if (above === bellow && Date.now() > this.dragTransitionStart + 100) {
          let afterIndex = this.dragOverIndex
          if (above !== this.dragOverIndex) {
            afterIndex = above
          }
          else if (bellow + 1 !== this.dragOverIndex) {
            afterIndex = bellow + 1
          }

          this.placeDragOver(afterIndex)

        }
      }
      else {
        this.handleDragOut()
      }
    },

    handleDragOut(e) {
      this.clearDragOver()

      for (let nodes of this.nodes) {
        for (let node of nodes) {
          node.handleDragOut()
        }
      }
    },

    handleDragOutGraph() {
      this.clearDragOver()
      this.draggedOver = false

      for (let nodes of this.nodes) {
        for (let node of nodes) {
          node.handleDragOutGraph()
        }
      }

    },

    placeDragOver(afterIndex) {
      if (afterIndex !== this.dragOverIndex) {
        this.clearDragOver()
        if (afterIndex < this.dragNodes.length) {
          this.dragNodes[afterIndex].el.style.marginTop = '40px'
        }
        else {
          this.dragNodes[this.dragNodes.length - 1].el.style.marginBottom = '40px'
        }
        this.dragOverIndex = afterIndex
        this.dragTransitionStart = Date.now()
      }
    },

    clearDragOver() {
      if (this.dragOverIndex >= 0) {
        if (this.dragOverIndex < this.dragNodes.length) {
          this.dragNodes[this.dragOverIndex].el.style.marginTop = null
        }
        else {
          this.dragNodes[this.dragNodes.length - 1].el.style.marginBottom = null
        }
      }
    },

    handleNodeDragStart(e) {
      this.$emit('node-drag-start', e)
    },

    getDraggableElement() {
      return this.$refs.conditionList
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
    @include animate-margin;
    position: relative;
}

.if-content {
    @extend %node-list;

    .condition-list {
        @extend %node-list;
    }

    & > .node-container {
        margin-top: $line-margin;

        &:empty {
            padding-top: 29px;
        }
    }
}

.else-content {
    @extend %node-list;

    margin-top: $line-margin;

    & > .node-container {
        margin-top: $line-margin;

        &.dragged-over {
            padding-bottom: 29px;
        }
    }
}
</style>
