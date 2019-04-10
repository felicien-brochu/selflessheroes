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
import LineNumbers from './LineNumbers'
import AutoScroll from './AutoScroll'
import {
  getLineNumbersFromNodeGraph
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
    this.dragHandler = null
    this.dragOverIndex = -1
    this.dragTransitionStart = -1
  },
  watch: {
    nodes: function(nodes) {
      this.lineNumbers = getLineNumbersFromNodeGraph(nodes)
      this.$emit('nodes-change', this.nodes)
    },

    statements: function(statements) {
      this.clearNodeContainer()
      this.populateNodeContainer()
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
        node.$on('drag-start', this.handleNodeDragStart)
        node.$on('node-drag-start', this.handleNodeDragStart)
      }
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
      let event = this.dragEvent
      let handler = null

      let above = -1
      let bellow = -1
      for (let i = 0; i < this.nodes.length; i++) {
        let node = this.nodes[i]
        if (node === event.node) {
          continue
        }

        let nodeBox = node.getDraggableElement().getBoundingClientRect()
        if (event.y + event.height >= nodeBox.top + 21) {
          bellow = i
        }
        if (event.y <= nodeBox.top + nodeBox.height - 2) {
          if (above < 0) {
            above = i
          }
        }
        let subHandler = node.handleDragOver(event)
        if (!!subHandler && !handler) {
          handler = subHandler
        }
      }

      let needRecall = false
      if (handler === null) {
        if (Date.now() > this.dragTransitionStart + 100) {
          let afterIndex = above
          if (above === bellow) {
            if (above !== this.dragOverIndex) {
              afterIndex = above
            }
            else if (bellow + 1 !== this.dragOverIndex) {
              afterIndex = bellow + 1
              if (afterIndex < this.nodes.length &&
                this.nodes[afterIndex] &&
                this.nodes[afterIndex] === event.node) {
                afterIndex++
              }
            }
          }

          if (afterIndex < 0) {
            afterIndex = this.nodes.length
          }

          needRecall = afterIndex !== this.dragOverIndex
          this.placeDragOver(afterIndex)
        }

        handler = {
          node: this,
          insertIndex: this.dragOverIndex,
          needRecall: needRecall
        }
      }
      else {
        this.clearDragOver()
      }

      this.dragHandler = handler
      if (handler.needRecall) {
        this.$parent.programDragOverRecall()
      }
    },

    placeDragOver(afterIndex) {
      if (afterIndex !== this.dragOverIndex) {
        if (afterIndex < this.nodes.length) {
          this.nodes[afterIndex].$el.style.marginTop = '40px'
        }
        else if (this.nodes.length > 0) {
          this.nodes[this.nodes.length - 1].$el.style.marginBottom = '40px'
        }
        this.clearDragOver()
        this.dragOverIndex = afterIndex
        this.dragTransitionStart = Date.now()
      }
    },

    clearDragOver() {
      if (this.dragOverIndex >= 0) {
        if (this.dragOverIndex < this.nodes.length) {
          this.nodes[this.dragOverIndex].$el.style.marginTop = null
        }
        else if (this.nodes.length > 0) {
          this.nodes[this.nodes.length - 1].$el.style.marginBottom = null
        }
        this.dragOverIndex = -1
        this.dragTransitionStart = Date.now()
      }
    },

    handleDragOut() {
      this.dragHandler = null
      this.autoScroll.stop()
      this.clearDragOver()
      for (let node of this.nodes) {
        node.handleDragOutGraph()
      }
    },

    handleDrop(e) {
      this.autoScroll.stop()
      this.clearDragOver()
      for (let node of this.nodes) {
        node.handleDrop(e)
      }

      this.$emit('drop-node', this.dragHandler)
    }
  }
}
</script>

<style lang="scss">
@import 'constants';
.node-container {
    @extend %node-list;
    padding-left: 15px;
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
