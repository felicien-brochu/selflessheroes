<template>
<div :class="{
	'drag-and-drop-layer': true,
	'disabled': !startDragEvent
	}"
  @mouseup="handleDrop"
  @touchend="handleDrop"
  @mousemove="handleDragOver"
  @touchmove="handleDragOver"
  @mouseleave="handleDragOut"
  @touchcancel="handleDragOut">

  <div class="drag-container"
    ref="dragContainer">

    <component v-if="node"
      ref="draggedNode"
      :is="node.component"
      :statement="node.statement"
      :statements="node.statements"
      :compilerConfig="compilerConfig" />

  </div>

</div>
</template>

<script>
import PaletteStatement from './PaletteStatement'
import Vue from 'vue'
import NodeBuilder from './nodes/NodeBuilder'

export default {
  props: {
    startDragEvent: {
      type: Object,
      default: null
    },
    compilerConfig: {
      type: Object
    }
  },
  data: function() {
    return {
      statements: null
    }
  },
  computed: {
    node: function() {
      let nodes = NodeBuilder.buildNodeList(this.statements)
      if (nodes.length === 0) {
        return null
      }
      else {
        return nodes[0]
      }
    }
  },
  watch: {
    startDragEvent: function(event, oldEvent) {
      console.log("#####startDragEvent watch", event)
      if (!oldEvent && !!event) {
        if (event.event.type === 'touchstart' && event.event.touches.length !== 1) {
          return
        }
        this.createDraggedElement()

        Vue.nextTick(function() {
          this.handleDragOver(event.event)
        }, this)
        event.event.preventDefault()
      }
    }
  },

  mounted() {
    this.touchEventProxySource = null
    this.touchEventProxy = null
  },

  methods: {
    handleDragOver(e) {
      let eventPosition = e

      if (e.type === 'touchmove' || e.type === 'touchstart') {
        e.preventDefault()
        if (e.touches.length !== 1) {
          return
        }
        eventPosition = e.touches[0]
      }

      this.$refs.dragContainer.style.left = `${ eventPosition.clientX - this.offsetX }px`
      this.$refs.dragContainer.style.top = `${ eventPosition.clientY - this.offsetY }px`

      let draggableElement = this.$refs.draggedNode.getDraggableElement()
      let draggableBox = draggableElement.getBoundingClientRect()
      this.$emit('drag-over', {
        x: draggableBox.x,
        y: draggableBox.y,
        width: draggableBox.width,
        height: draggableBox.height,
        node: this.startDragEvent.node
      })
    },

    handleDrop(e) {
      if (e.type === 'touchend') {
        e.preventDefault()
      }
      this.statements = null
      this.destroyTouchEventProxy()
      this.$emit('drop', e)
    },

    handleDragOut(e) {
      this.statements = null
      this.$emit('drop', null)
    },

    createTouchEventProxy(source) {
      source.addEventListener('touchmove', this.touchEventProxy)
      source.addEventListener('touchend', this.touchEventProxy)
      this.touchEventProxySource = source
    },

    touchEventProxy(e) {
      e.preventDefault()
      if (this.$refs.draggedNode) {
        this.$refs.draggedNode.$el.dispatchEvent(new TouchEvent(e.type, e))
      }
    },

    destroyTouchEventProxy() {
      if (this.touchEventProxySource) {
        this.touchEventProxySource.removeEventListener('touchmove', this.touchEventProxy)
        this.touchEventProxySource.removeEventListener('touchend', this.touchEventProxy)
        this.touchEventProxySource = null
      }
    },

    createDraggedElement() {
      let dragContainer = this.$refs.dragContainer
      let event = this.startDragEvent

      let eventPosition = event.event
      if (event.event.type === 'touchstart') {
        eventPosition = event.event.touches[0]
      }

      let targetPosition
      if (event.isNew) {
        targetPosition = eventPosition.target.getBoundingClientRect()
        this.createTouchEventProxy(eventPosition.target)
      }
      else {
        targetPosition = event.draggedElement.getBoundingClientRect()
      }

      this.offsetX = eventPosition.clientX - targetPosition.left
      this.offsetY = eventPosition.clientY - targetPosition.top

      dragContainer.style.left = `${ targetPosition.left }px`
      dragContainer.style.top = `${ targetPosition.top }px`
      this.statements = event.statements
    }
  }
}
</script>

<style lang="scss">
.drag-and-drop-layer {
    width: 100%;
    height: 100%;
    cursor: grabbing;

    .drag-container {
        position: absolute;
        display: flex;
        list-style: none;

        .palette-statement {
            cursor: grabbing !important;
        }
    }
}

.disabled {
    display: none;
}
</style>
