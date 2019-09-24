<template>
<div :class="['popup', 'direction-popup', colorClass]">
  <ul class="direction-tiles">
    <li v-for="dir in directionNames"
      :class="{
				'selected': selectedDirectionNames.includes(dir),
				'no-value': notHere && dir === 'here'
			}"
      @mousedown.prevent.stop="handleDirectionClick(dir)"
      @touchstart.prevent.stop="handleDirectionClick(dir)">
      <button class="tile" />
      <div :class="{
				'tile-icon': true,
				'tile-nw': dir === 'nw',
				'tile-n': dir === 'n',
				'tile-ne': dir === 'ne',
				'tile-w': dir === 'w',
				'tile-here': dir === 'here',
				'tile-e': dir === 'e',
				'tile-sw': dir === 'sw',
				'tile-s': dir === 's',
				'tile-se': dir === 'se'
			}" />
    </li>
  </ul>
</div>
</template>

<script>
import Popup from './Popup'
import DirectionLiteral from '../../../../world/ai/compile/statements/literals/DirectionLiteral'
import Direction from '../../../../world/Direction'

export default {
  extends: Popup,
  props: {
    'directions': {
      type: Array
    },
    'multiple': {
      type: Boolean
    },
    'notHere': {
      type: Boolean,
      default: false
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
      if (this.notHere && dirName === 'here') {
        return
      }
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
@import '../../mixins';

.direction-popup {
    border-radius: 5px;

    .direction-tiles {
        width: 92px;
        height: 92px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: space-between;

        li {
            display: flex;
            position: relative;
            justify-content: center;
            align-items: center;
            height: 30px;
            width: 30px;

            &.no-value .tile {
                display: none;
            }

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

            .tile-icon {
                position: absolute;
                width: 100%;
                height: 100%;
                background-position: center;
                background-repeat: no-repeat;
                background-size: 57%;
            }

            .tile-here {
                background-image: url("../../../images/hero-icon.png");
                background-size: 68%;
            }
            .tile-nw {
                background-image: url("../../../images/direction-nw-icon.png");
                background-position: left 73% top 73%;
            }
            .tile-n {
                background-image: url("../../../images/direction-n-icon.png");
                background-position: left 50% top 70%;
            }
            .tile-ne {
                background-image: url("../../../images/direction-ne-icon.png");
                background-position: right 73% top 73%;
            }
            .tile-w {
                background-image: url("../../../images/direction-w-icon.png");
                background-position: top 50% left 70%;
            }
            .tile-e {
                background-image: url("../../../images/direction-e-icon.png");
                background-position: top 50% right 70%;
            }
            .tile-sw {
                background-image: url("../../../images/direction-sw-icon.png");
                background-position: left 73% bottom 73%;
            }
            .tile-s {
                background-image: url("../../../images/direction-s-icon.png");
                background-position: left 50% bottom 70%;
            }
            .tile-se {
                background-image: url("../../../images/direction-se-icon.png");
                background-position: right 73% bottom 73%;
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
                .tile {
                    background-color: transparentize(white, 0.2);
                }
            }
        }
    }
}
</style>
