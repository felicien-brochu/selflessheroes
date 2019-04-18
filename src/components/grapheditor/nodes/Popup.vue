<template>
<div :class="['popup', colorClass]" />
</template>

<script>
import IntegerLiteral from '../../../world/ai/compile/statements/literals/IntegerLiteral'

export default {
  props: {
    'anchor': {
      type: Element
    },
    'frame': {
      type: Element
    },
    'parentType': {
      type: String,
      validator: value => {
        return ['branching', 'action', 'assign'].includes(value)
      },
      default: 'branching'
    }
  },

  data: function() {
    return {
      centeredX: true,
      centeredY: true,
      offsetX: 0,
      offsetY: 0
    }
  },

  computed: {
    colorClass: function() {
      if (this.parentType === 'branching') {
        return 'branching'
      }
      else if (this.parentType === 'action') {
        return 'action'
      }
      else if (this.parentType === 'assign') {
        return 'assign'
      }
    }
  },

  methods: {
    updatePosition(horizontalPadding, verticalPadding) {
      let anchorBox = this.anchor.getBoundingClientRect()
      let frameBox = this.frame.getBoundingClientRect()
      let thisBox = this.$el.getBoundingClientRect()
      let x
      let y
      if (this.centeredX) {
        x = anchorBox.x + (anchorBox.width / 2) - (thisBox.width / 2) + this.offsetX
      }
      else {
        x = anchorBox.x + this.offsetX
      }
      if (this.centeredY) {
        y = anchorBox.y + (anchorBox.height / 2) - (thisBox.height / 2) + this.offsetY
      }
      else {
        y = anchorBox.y + this.offsetY
      }


      // Keep the drop down list in the frame if possible
      if (x < frameBox.left + horizontalPadding) {
        x = frameBox.left + horizontalPadding
      }
      if (x + thisBox.width > frameBox.right - horizontalPadding) {
        x = frameBox.right - thisBox.width - horizontalPadding
      }
      if (y + thisBox.height > frameBox.bottom - verticalPadding) {
        y = frameBox.bottom - thisBox.height - verticalPadding
      }
      if (y < frameBox.top + verticalPadding) {
        y = frameBox.top + verticalPadding
      }

      this.$el.style.left = `${x}px`
      this.$el.style.top = `${y}px`
    }
  }

}
</script>

<style lang="scss">
@import '../../constants';

.popup {
    @include node-shadow;
    @include no-select;

    position: absolute;

    &.branching {
        $popup-branching-color: lighten($branching-color, 5%);
        background-color: $popup-branching-color;
        color: darken($popup-branching-color, $text-darken);
    }
    &.action {
        $popup-action-color: lighten($action-color, 5%);
        background-color: $popup-action-color;
        color: darken($popup-action-color, $text-darken);
    }
    &.assign {
        $popup-assign-color: lighten($assign-color, 5%);
        background-color: $popup-assign-color;
        color: darken($popup-assign-color, $text-darken);
    }
}
</style>
