<template>
<div class="direction-popup">
  <table class="direction-values">
    <tr>
      <td :class="{'selected': directionNames.includes('nw')}"
        @click="select('nw')" />
      <td :class="{'selected': directionNames.includes('n')}"
        @click="select('n')" />
      <td :class="{'selected': directionNames.includes('ne')}"
        @click="select('ne')" />
    </tr>
    <tr>
      <td :class="{'selected': directionNames.includes('w')}"
        @click="select('w')" />
      <td :class="{'selected': directionNames.includes('here')}"
        @click="select('here')" />
      <td :class="{'selected': directionNames.includes('e')}"
        @click="select('e')" />
    </tr>
    <tr>
      <td :class="{'selected': directionNames.includes('sw')}"
        @click="select('sw')" />
      <td :class="{'selected': directionNames.includes('s')}"
        @click="select('s')" />
      <td :class="{'selected': directionNames.includes('se')}"
        @click="select('se')" />
    </tr>
  </table>
</div>
</template>

<script>
import DirectionLiteral from '../../../world/ai/compile/statements/literals/DirectionLiteral'
import Direction from '../../../world/Direction'

export default {
  props: {
    'directions': {
      type: Array
    },
    'multiple': {
      type: Boolean
    },
    'anchor': {
      type: Element
    },
    'frame': {
      type: Element
    },
  },
  data: function() {
    return {
      selectedDirections: this.directions
    }
  },
  computed: {
    directionNames: function() {
      return this.selectedDirections.map(direction => direction.name)
    }
  },

  mounted() {
    this.cancelled = false
    this.valueSelected = false
  },

  methods: {
    close() {
      if (!this.valueSelected) {
        this.valueSelected = true
        this.$emit('select-value', this.selectedDirections)
      }
    },

    select(dirName) {
      if (!this.selectedDirections.some(direction => direction.name === dirName)) {
        let directionLiteral = new DirectionLiteral(null)
        directionLiteral.value = Direction[dirName]
        directionLiteral.name = dirName

        let directions = this.selectedDirections
        if (!this.multiple) {
          directions = []
        }
        directions.push(directionLiteral)
        this.selectedDirections = directions
      }

      if (!this.multiple) {
        this.valueSelected = true
        this.$emit('select-value', this.selectedDirections)
      }
    },

    updatePosition(horizontalPadding, verticalPadding) {
      let anchorBox = this.anchor.getBoundingClientRect()
      let frameBox = this.frame.getBoundingClientRect()
      let thisBox = this.$el.getBoundingClientRect()
      let x = anchorBox.x + (anchorBox.width / 2) - (thisBox.width / 2) - 8
      let y = anchorBox.y + (anchorBox.height / 2) - (thisBox.height / 2)

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
@import '../constants';

.direction-popup {
    @include node-shadow;
    position: absolute;
    padding: 6px;
    border-radius: 3px;
    background: $drop-down-color;
    width: 50px;
    height: 50px;

    .direction-values {
        border-spacing: 2px;
        tr {
            td {
                width: 14px;
                height: 14px;
                border-radius: 1px;

                &:hover:not(.selected) {
                    background-color: transparentize(white, 0.6);
                }
            }
        }
    }
}
</style>
