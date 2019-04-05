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
  watch: {
    startDragEvent: function(event, oldEvent) {
      if (!oldEvent && !!event) {
        if (event.isNew) {
          let ComponentClass = Vue.extend(PaletteStatement)
          let instance = new ComponentClass({
            propsData: {
              statement: event.statement
            }
          })
          instance.$mount()
          this.$refs.dragContainer.appendChild(instance.$el)
          let targetPosition = event.event.target.getBoundingClientRect()
          this.offsetX = event.event.clientX - targetPosition.left
          this.offsetY = event.event.clientY - targetPosition.top

          this.$refs.dragContainer.style.left = `${ targetPosition.left }px`
          this.$refs.dragContainer.style.top = `${ targetPosition.top }px`
        }
      }
    }
  },
  methods: {
    handleDragOver(e) {
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

        .palette-statement {
            cursor: grabbing !important;
        }
    }
}

.disabled {
    display: none;
}
</style>
