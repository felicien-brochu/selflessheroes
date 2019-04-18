<template>
<div :class="['popup', 'direction-popup', colorClass]">
  <ul class="direction-values">
    <li v-for="dir in directionNames"
      :class="{'selected': selectedDirectionNames.includes(dir)}"
      @click="handleDirectionClick(dir)">
      <button class="tile" />
    </li>
  </ul>
  </table>
</div>
</template>

<script>
import Popup from './Popup'
import DirectionLiteral from '../../../world/ai/compile/statements/literals/DirectionLiteral'
import Direction from '../../../world/Direction'

export default {
  extends: Popup,
  props: {
    'directions': {
      type: Array
    },
    'multiple': {
      type: Boolean
    }
  },
  data: function() {
    const directionNames = ['nw', 'n', 'ne', 'w', 'here', 'e', 'sw', 's', 'se']

    return {
      selectedDirections: this.directions,
      directionNames: directionNames,

      centeredX: true,
      centeredY: true,
      offsetX: -8,
      offsetY: 0
    }
  },
  computed: {
    selectedDirectionNames: function() {
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

    handleDirectionClick(dirName) {
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
      else if (this.multiple) {
        this.selectedDirections = this.selectedDirections.filter(dir => dir.name !== dirName)
      }

      if (!this.multiple) {
        this.valueSelected = true
        this.$emit('select-value', this.selectedDirections)
      }
    }
  }

}
</script>

<style lang="scss">
@import '../../constants';

.direction-popup {
    border-radius: 5px;

    .direction-values {
        width: 92px;
        height: 92px;
        li {

            background: none;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 30px;
            width: 30px;

            &:nth-child(3n) {
                width: 31px;
                justify-content: flex-start;
            }
            &:nth-child(3n + 1) {
                width: 31px;
                justify-content: flex-end;
            }
            &:nth-child(-n + 3) {
                height: 31px;
                align-items: flex-end;
            }
            &:nth-child(n + 7) {
                height: 31px;
                align-items: flex-start;
            }

            .tile {
                background-color: transparentize(white, 0.75);
                width: 24px;
                height: 24px;
                border-radius: 2px;
                border: none;
            }

            &:hover:not(.selected) {
                .tile {
                    background-color: transparentize(white, 0.6);
                }
            }

            &.selected,
            &:active {
                background: none;
                .tile {
                    background-color: transparentize(white, 0.2);
                }
            }
        }
    }
}
</style>
