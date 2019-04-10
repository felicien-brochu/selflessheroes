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
    ref="dragContainer" />

</div>
</template>

<script>
import PaletteStatement from './PaletteStatement'
import Vue from 'vue'

export default {
  props: {
    startDragEvent: {
      type: Object,
      default: null
    }
  },
  data: function() {
    return {
      elementCreated: false
    }
  },
  watch: {
    startDragEvent: function(event, oldEvent) {
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

      let draggableElement = this.startDragEvent.node.getDraggableElement()
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
      this.clearDragContainer()
      this.destroyTouchEventProxy()
      this.$emit('drop', e)
    },

    handleDragOut(e) {
      this.clearDragContainer()
      this.$emit('drop', null)
    },

    clearDragContainer() {
      let container = this.$refs.dragContainer
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
      this.elementCreated = false
    },

    createTouchEventProxy(source, target) {
      this.touchEventProxy = function(e) {
        e.preventDefault()
        target.dispatchEvent(new TouchEvent(e.type, e));
      }
      source.addEventListener('touchmove', this.touchEventProxy)
      source.addEventListener('touchend', this.touchEventProxy)
      this.touchEventProxySource = source
    },

    destroyTouchEventProxy() {
      if (this.touchEventProxy) {
        this.touchEventProxySource.removeEventListener('touchmove', this.touchEventProxy)
        this.touchEventProxySource.removeEventListener('touchend', this.touchEventProxy)
        this.touchEventProxySource = null
        this.touchEventProxy = null
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
        this.createTouchEventProxy(eventPosition.target, event.node.$el)
      }
      else {
        targetPosition = event.node.$el.getBoundingClientRect()
      }

      this.offsetX = eventPosition.clientX - targetPosition.left
      this.offsetY = eventPosition.clientY - targetPosition.top

      dragContainer.style.left = `${ targetPosition.left }px`
      dragContainer.style.top = `${ targetPosition.top }px`
      dragContainer.appendChild(event.node.$el)

      this.elementCreated = true
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
