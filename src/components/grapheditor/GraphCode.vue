<template>
<div :class="{
	'graph-scroll': true,
	'animate-margin': animateDragAndDrop
	}"
  ref="scroll"
  @scroll="$emit('scroll', $event)">
  <div class="graph-code">
    <slot></slot>
    <line-numbers :numbers="lineNumbers" />
    <ul class="node-container"
      ref="nodeContainer">

      <li v-for="node in nodeList"
        :is="node.component"
        ref="nodes"
        :statement="node.statement"
        :statements="node.statements"
        :compilerConfig="compilerConfig"
        @drag-start="handleOwnNodeDragStart($event, node.statement)"
        @node-drag-start="handleNodeDragStart" />
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
      dragEvent: null,
      animateDragAndDrop: false
    }
  },
  computed: {
    nodeList: function() {
      return NodeBuilder.buildNodeList(this.statements)
    }
  },
  mounted() {
    this.autoScroll = new AutoScroll(this.$refs.scroll, null)

    this.dragTree = null
    this.dragPlaceholderIndex = -1
    this.dropHandler = null
  },
  watch: {
    statements: function(statements) {
      this.lineNumbers = getLineNumbersFromStatements(statements)
      if (this.$refs.nodes) {
        this.$emit('nodes-change', this.$refs.nodes)
      }
    },
    dragEvent: function(dragEvent, oldEvent) {
      // Wait for next render of dom to make it animated
      if (!dragEvent !== !oldEvent) {
        setTimeout(function() {
          this.animateDragAndDrop = !!dragEvent
        }.bind(this), 0)
      }
    }
  },
  methods: {

    handleOwnNodeDragStart(e, statement) {
      this.handleNodeDragStart({
        event: e.event,
        draggedElement: e.node.getDraggableElement(),
        statement: statement
      })
    },

    handleNodeDragStart(e) {
      this.$emit('node-drag-start', e)
    },

    handleDragOver(e) {
      let scrollBounds = this.$refs.scroll.getBoundingClientRect()
      if (e.x >= scrollBounds.left - 40 &&
        e.x + e.width >= scrollBounds.left &&
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
      // if (!this.dragTree) {
      this.generateDragTree()
      // }
      let res = this.dragTree.handleDragOver(this.dragEvent, this.$el.getBoundingClientRect(), this.$refs.scroll)
      this.dropHandler = res.dropHandler
      if (res.dragPositionChanged) {
        this.$parent.startDragOverChangeAnimation()
      }
    },

    generateDragTree() {
      this.dragTree = new DragTree(this, this.$refs.nodes, 46)
    },

    showDragPlaceholderAt(index, placeholderHeight) {
      this.hideDragPlaceholder()
      if (index < this.$refs.nodes.length) {
        this.$refs.nodes[index].$el.style.marginTop = `${placeholderHeight + 12}px`
      }
      else {
        if (this.$refs.nodes.length > 0) {
          this.$refs.nodes[index - 1].$el.style.marginBottom = `${placeholderHeight + 12}px`
        }
      }
      this.dragPlaceholderIndex = index
    },

    hideDragPlaceholder() {
      if (this.dragPlaceholderIndex >= 0) {
        if (this.dragPlaceholderIndex < this.$refs.nodes.length) {
          this.$refs.nodes[this.dragPlaceholderIndex].$el.style.marginTop = null
        }
        else {
          if (this.$refs.nodes.length > 0) {
            this.$refs.nodes[this.dragPlaceholderIndex - 1].$el.style.marginBottom = null
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

      this.hideDragPlaceholder()
      for (let node of this.$refs.nodes) {
        node.handleDrop(e)
      }

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
            padding-top: 12px;
            padding-bottom: 46px;
            z-index: 10;
        }

        .code-lines {
            height: auto;
        }
    }
}
</style>
