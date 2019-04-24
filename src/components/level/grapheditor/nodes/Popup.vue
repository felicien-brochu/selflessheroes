<template>
<div :class="['popup', colorClass]" />
</template>

<script>
import IntegerLiteral from '../../../../world/ai/compile/statements/literals/IntegerLiteral'

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
    },
    'verticalPadding': {
      type: Number,
      default: 0
    },
    'horizontalPadding': {
      type: Number,
      default: 0
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

  mounted() {
    this.updatePosition(0, 0)
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
    updatePosition() {
      let anchorBox = this.anchor.getBoundingClientRect()
      let frameBox = this.frame.getBoundingClientRect()
      let thisBox = this.$el.getBoundingClientRect()
      let x
      let y
      if (this.centeredX) {
        x = anchorBox.x + (anchorBox.width / 2) - (this.$el.offsetWidth / 2) + this.offsetX
      }
      else {
        x = anchorBox.x + this.offsetX
      }
      if (this.centeredY) {
        y = anchorBox.y + (anchorBox.height / 2) - (this.$el.offsetHeight / 2) + this.offsetY
      }
      else {
        y = anchorBox.y + this.offsetY
      }


      // Keep the drop down list in the frame if possible
      if (x < frameBox.left + this.horizontalPadding) {
        x = frameBox.left + this.horizontalPadding
      }
      if (x + this.$el.offsetWidth > frameBox.right - this.horizontalPadding) {
        x = frameBox.right - this.$el.offsetWidth - this.horizontalPadding
      }
      if (y + this.$el.offsetHeight > frameBox.bottom - this.verticalPadding) {
        y = frameBox.bottom - this.$el.offsetHeight - this.verticalPadding
      }
      if (y < frameBox.top + this.verticalPadding) {
        y = frameBox.top + this.verticalPadding
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
