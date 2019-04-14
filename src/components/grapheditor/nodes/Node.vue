<template>
<div :class="{
	'node': true,
	'drag-over-top': dragOverTop,
	'drag-over-bottom': dragOverBottom
}">
</div>
</template>

<script>
export default {
  props: {
    'statement': {
      type: Object,
      default: null
    },
    'compilerConfig': {
      type: Object,
      default: null
    }
  },
  data: function() {
    return {}
  },
  methods: {
    handleDragStart(e) {
      if (e.type === 'touchstart') {
        if (e.touches.length !== 1) {
          return
        }
        e.preventDefault()
      }
      if (this.isDraggableElement(e.target)) {
        this.$emit('drag-start', {
          event: e,
          node: this
        })
      }
    },

    isDraggableElement(element) {
      return element === this.$el
    },

    getHeaderLineNumber() {
      return 1
    },

    handleDragOver() {
      return false
    },

    showDragPlaceholderAt(index, placeholderHeight) {},
    hideDragPlaceholder() {},

    handleDragOut() {},
    handleDragOutGraph() {},
    handleDrop(e) {},

    getDraggableElement() {
      return this.$el
    }
  }
}
</script>

<style lang="scss">
@import '../constants';

.animate-margin {
    .if-node,
    .node {
        @include animate-margin;
    }
}
.node {
    @extend %node;
}
.branching-node {
    @include node-color($branching-color);
}
</style>
