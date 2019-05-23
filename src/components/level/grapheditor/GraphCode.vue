<template>
<div :class="{
		'graph-scroll': true,
		'animate-margin': animateDragAndDrop
	}"
  ref="scroll"
  @scroll="$emit('scroll', $event)"
  @mousedown="$emit('start-edit')"
  @touchstart="$emit('start-edit')">

  <div class="graph-code">
    <slot></slot>

    <ul class="node-container"
      ref="nodeContainer">
    </ul>

  </div>
</div>
</template>

<script>
import IfStatement from '../../../world/ai/compile/statements/IfStatement'
import ElseStatement from '../../../world/ai/compile/statements/ElseStatement'
import NodeBuilder from './nodes/NodeBuilder'
import DragTree from './DragTree'
import AutoScroll from './AutoScroll'
import ScrollAnimator from '../util/ScrollAnimator'
import {
  lineMargin,
  lineHeight
}
from './nodes/NodeBuilder'

export default {
  props: {
    'statements': {
      type: Array,
      default: () => null
    },
    'compilerConfig': {
      type: Object,
      default: null
    },
    'insertedStatement': Object
  },

  data: function() {
    return {
      nodes: [],
      dragEvent: null,
      animateDragAndDrop: false
    }
  },

  mounted() {
    this.autoScroll = new AutoScroll(this.$refs.scroll, null)
    this.scrollAnimator = new ScrollAnimator(this.$refs.scroll, lineHeight)

    this.dragTree = null
    this.dragPlaceholderIndex = -1
    this.dropHandler = null
    this.dropScrollTop = 0
    this.dragStartScrollTop = -1
  },

  watch: {
    statements: function(statements, oldStatements) {
      this.clearNodeContainer()
      this.populateNodeContainer()
      this.$emit('nodes-change', this.nodes, statements)
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
    clearNodeContainer() {
      let container = this.$refs.nodeContainer
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    },

    populateNodeContainer() {
      let nodeBuilder = new NodeBuilder(this.statements)
      this.nodes = nodeBuilder.build(this.compilerConfig, this.insertedStatement)
      let container = this.$refs.nodeContainer
      for (let node of this.nodes) {
        container.appendChild(node.$el)
        node.$parent = this
        node.$on('drag-start', this.handleOwnNodeDragStart)
        node.$on('node-drag-start', this.handleNodeDragStart)
        node.$on('change', this.handleNodeChange)
        node.$on('start-edit', this.handleStartEdit)
      }
    },

    handleNodeChange(e) {
      this.$emit('node-change', e)
    },

    handleOwnNodeDragStart(e) {
      this.nodes.splice(this.nodes.indexOf(e.node), 1)
      this.handleNodeDragStart(e)
    },

    handleNodeDragStart(e) {
      this.dragStartScrollTop = this.$refs.scroll.scrollTop
      this.$emit('node-drag-start', e)

      // Fix scrolling
      setTimeout(function() {
        this.$refs.scroll.scrollTop = this.dragStartScrollTop
        this.dragStartScrollTop = -1
        this.applyDragOver()
      }.bind(this), 0)
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
      if (!this.dragTree) {
        this.generateDragTree()
      }
      let dragPositionChanged = this.dragTree.handleDragOver(this.dragEvent, this.$el.getBoundingClientRect(), this.$refs.scroll)
      this.dropHandler = this.dragTree.dropHandler
      if (dragPositionChanged) {
        this.$parent.startDragOverChangeAnimation()
      }
    },

    handleStartEdit() {
      this.$emit('start-edit')
    },

    generateDragTree() {
      this.dragTree = new DragTree(this, this.nodes, lineHeight)
    },

    showDragPlaceholderAt(index, placeholderHeight) {
      this.hideDragPlaceholder()
      if (index < this.nodes.length) {
        this.nodes[index].$el.style.marginTop = `${placeholderHeight + lineMargin}px`
      }
      else {
        if (this.nodes.length > 0) {
          this.nodes[index - 1].$el.style.marginBottom = `${placeholderHeight + lineMargin}px`
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
      this.dropScrollTop = this.$refs.scroll.scrollTop
      this.$emit('drop-node', this.dropHandler)

      this.autoScroll.stop()
    },

    handleStatementDropped(statement) {
      if (this.dropHandler) {
        let scrollTopDelta = this.dragTree.getScrollTopDelta(
          statement,
          this,
          this.nodes,
          this.$refs.scroll.scrollTop,
          this.dropScrollTop)

        this.$refs.scroll.scrollTop += scrollTopDelta
      }

      this.dropHandler = null
      this.dragEvent = null
      this.dragTree = null
      this.dragPlaceholderIndex = -1
    },

    handleFollowHeroCursorLineChange(line) {
      this.scrollAnimator.showLine(line)
    }
  }
}
</script>

<style lang="scss">
@import '../mixins';
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
            padding-top: $line-margin;
            padding-bottom: $node-line-height + $line-margin + 10;
            z-index: 10;
        }
    }
}
</style>
