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
          console.log("###Layer CREATE ghost from Palette", event)
          let ComponentClass = Vue.extend(PaletteStatement)
          let instance = new ComponentClass({
            propsData: {
              statement: event.statement
            }
          })
          instance.$mount()
          console.log(this.$refs.dragContainer)
          this.$refs.dragContainer.appendChild(instance.$el)
          let targetPosition = event.event.target.getBoundingClientRect()
          this.offsetX = event.event.clientX - targetPosition.left
          this.offsetY = event.event.clientY - targetPosition.top
          // instance.$el.style = "left: " + targetPosition.left + "px; top: " + targetPosition.top + "px;"
          console.log(this.offsetX, this.offsetY)
          this.$refs.dragContainer.style = `left: ${ targetPosition.left }px; top: ${ targetPosition.top }px;`
        }
      }
    }
  },
  methods: {
    handleDragOver(e) {
      // console.log('###dragover layer', e, e.x + this.offsetX)
      this.$refs.dragContainer.style = `left: ${ e.x - this.offsetX }px; top: ${ e.y - this.offsetY }px;`
      e.preventDefault()
    },
    handleDrop(e) {
      // console.log('###drop layer', e)
      this.$refs.dragContainer.innerHTML = ''
      this.$emit('drop', e)
    },
    handleDragOut(e) {
      this.$refs.dragContainer.innerHTML = ''
      this.$emit('drop', e)
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
