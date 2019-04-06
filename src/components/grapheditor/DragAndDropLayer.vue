<template>
<div :class="{
	'drag-and-drop-layer': true,
	'disabled': !startDragEvent
	}"
  @mouseup="handleDrop"
  @mousemove="handleDragOver"
  @mouseleave="handleDragOut">

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
        // Record offset of click on target
        let targetPosition = event.event.target.getBoundingClientRect()
        this.offsetX = event.event.clientX - targetPosition.left
        this.offsetY = event.event.clientY - targetPosition.top
      }
    }
  },
  methods: {
    handleDragOver(e) {
      if (!this.elementCreated) {
        this.createDraggedElement()
      }
      this.$refs.dragContainer.style.left = `${ e.x - this.offsetX }px`
      this.$refs.dragContainer.style.top = `${ e.y - this.offsetY }px`
      e.preventDefault()
    },
    handleDrop(e) {
      this.clearDragContainer()
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
    createDraggedElement() {
      let dragContainer = this.$refs.dragContainer
      let event = this.startDragEvent
      if (event.isNew) {
        let ComponentClass = Vue.extend(PaletteStatement)
        let instance = new ComponentClass({
          propsData: {
            statement: event.statement
          }
        })
        instance.$mount()
        dragContainer.appendChild(instance.$el)

        dragContainer.style.left = `${ targetPosition.left }px`
        dragContainer.style.top = `${ targetPosition.top }px`
      }
      else {
        let targetPosition = event.event.target.getBoundingClientRect()
        this.offsetX = event.event.clientX - targetPosition.left
        this.offsetY = event.event.clientY - targetPosition.top

        dragContainer.style.left = `${ targetPosition.left }px`
        dragContainer.style.top = `${ targetPosition.top }px`
        dragContainer.appendChild(event.node.$el)
      }
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
