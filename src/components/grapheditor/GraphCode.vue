<template>
<div class="graph-scroll"
  ref="scroll"
  @scroll="$emit('scroll', $event)">
  <div class="graph-code">
    <slot></slot>
    <line-numbers :numbers="lineNumbers" />
    <ul class="node-container"
      ref="nodeContainer">
    </ul>
  </div>
</div>
</template>

<script>
import NodeBuilder from './nodes/NodeBuilder'
import DragTree from './DragTree'
import LineNumbers from './LineNumbers'
import AutoScroll from './AutoScroll'
import {
  getLineNumbersFromStatements
}
from './utils'

export default {
  components: {
    LineNumbers
  },
  props: {
    'code': {
      type: String,
      default: ''
    },
    'statements': {
      type: Array,
      default: () => []
    },
    'compilerConfig': {
      type: Object,
      default: null
    },
    'worldReady': {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      lineNumbers: [],
      nodes: []
    }
  },
  mounted() {
    this.autoScroll = new AutoScroll(this.$refs.scroll, null)

    this.dragEvent = null
    this.dragTree = null
    this.dragPlaceholderIndex = -1
    this.dropHandler = null
  },
  watch: {
    statements: function(statements) {
      this.lineNumbers = getLineNumbersFromStatements(statements)
      this.clearNodeContainer()
      this.populateNodeContainer()
      this.$emit('nodes-change', this.nodes)
    }
  },
  methods: {
    clearNodeContainer() {
      let container = this.$refs.nodeContainer
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    },

    populateNodeContainer() {
      let nodeBuilder = new NodeBuilder(this.statements)
      this.nodes = nodeBuilder.build(this.compilerConfig)
      let container = this.$refs.nodeContainer
      for (let node of this.nodes) {
        container.appendChild(node.$el)
        node.$parent = this
        node.$on('drag-start', this.handleOwnNodeDragStart)
        node.$on('node-drag-start', this.handleNodeDragStart)
      }
    },

    handleOwnNodeDragStart(e) {
      this.nodes.splice(this.nodes.indexOf(e.node), 1)
      this.handleNodeDragStart(e)
    },

    handleNodeDragStart(e) {
      this.$emit('node-drag-start', e)
    },

    handleDragOver(e) {
      let scrollBounds = this.$refs.scroll.getBoundingClientRect()
      if (e.x + e.width >= scrollBounds.left &&
        e.y + e.height >= scrollBounds.top &&
        e.x <= scrollBounds.left + scrollBounds.width &&
        e.y <= scrollBounds.top + scrollBounds.height) {

        this.dragEvent = e
        this.autoScroll.update(e, this.applyDragOver)
        this.applyDragOver()
      }
      else {
        this.handleDragOut()
      }
    },

    applyDragOver() {
      if (!this.dragTree) {
        this.generateDragTree()
      }
      let res = this.dragTree.handleDragOver(this.dragEvent, this.$el.getBoundingClientRect(), this.$refs.scroll)
      this.dropHandler = res.dropHandler
      if (res.dragPositionChanged) {
        this.$parent.startDragOverChangeAnimation()
      }
    },

    generateDragTree() {
      this.dragTree = new DragTree(this, this.nodes, 46)
    },

    showDragPlaceholderAt(index, placeholderHeight) {
      this.hideDragPlaceholder()
      if (index < this.nodes.length) {
        this.nodes[index].$el.style.marginTop = `${placeholderHeight + 10}px`
      }
      else {
        if (this.nodes.length > 0) {
          this.nodes[index - 1].$el.style.marginBottom = `${placeholderHeight + 10}px`
        }
      }
      this.dragPlaceholderIndex = index
    },

    hideDragPlaceholder() {
      if (this.dragPlaceholderIndex >= 0) {
        if (this.dragPlaceholderIndex < this.nodes.length) {
          this.nodes[this.dragPlaceholderIndex].$el.style.marginTop = null
        }
        else {
          if (this.nodes.length > 0) {
            this.nodes[this.dragPlaceholderIndex - 1].$el.style.marginBottom = null
          }
        }
        this.dragPlaceholderIndex = -1
      }
    },

    handleDragOut() {
      if (this.dragTree) {
        this.dragTree.handleDragOut()
      }
      this.dropHandler = null
      this.autoScroll.stop()
    },

    handleDrop(e) {
      this.$emit('drop-node', this.dropHandler)

      this.autoScroll.stop()
      this.dragEvent = null
      this.dragTree = null
      this.dragPlaceholderIndex = -1
      this.dropHandler = null
    }
  }
}
</script>

<style lang="scss">
@import 'constants';
.node-container {
    @extend %node-list;
    padding-left: 20px;
}

.drag-placeholder {
    margin-bottom: 0;
    height: 0;
    transition-property: height;
    transition-duration: 1s;
}

.graph-scroll {
    overflow: auto;
    height: 100%;
    width: 100%;
    background-color: #282c34;

    .graph-code {
        display: flex;
        height: min-content;

        & > .node-container {
            padding-top: 10px;
            padding-bottom: 39px;
            z-index: 10;
        }

        .code-lines {
            height: auto;
        }
    }
}
</style>
