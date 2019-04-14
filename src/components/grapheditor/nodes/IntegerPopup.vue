<template>
<div :class="['popup', 'integer-popup', colorClass]">
  <div class="integer-input">

    <button class="minus-button"
      @mousedown="decrement"><span class="icon">-</span></button>
    <!--⯆-->
    <span class="number">
      {{integer}}
    </span>

    <button class="plus-button"
      @mousedown="increment"><span class="icon">+</span></button>
    <!--⯅-->

  </div>
</div>
</template>

<script>
import Popup from './Popup'
import IntegerLiteral from '../../../world/ai/compile/statements/literals/IntegerLiteral'

export default {
  extends: Popup,
  props: {
    'value': {
      type: IntegerLiteral
    },
    'max': {
      type: Number,
      default: 99
    },
    'min': {
      type: Number,
      default: 0
    }
  },
  data: function() {
    return {
      integer: this.value ? this.value.value : this.min,

      centeredX: true,
      centeredY: true,
      offsetX: -7,
      offsetY: 0
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
        let value = new IntegerLiteral(null)
        value.value = this.integer
        this.$emit('select-value', value)
      }
    },

    increment(e) {
      let number = this.integer + 1
      if (number > this.max) {
        number = this.min
      }
      this.integer = number
    },

    decrement(e) {
      let number = this.integer - 1
      if (number < this.min) {
        number = this.max
      }
      this.integer = number
    }
  }

}
</script>

<style lang="scss">
@import '../constants';

.integer-popup {
    border-radius: 5px;
    padding: 8px 10px;

    .integer-input {
        display: flex;
        flex-direction: row;
        align-items: center;

        .number {
            text-align: center;
            width: 36px;
            font-size: 22px;
            font-weight: 500;
        }

        .minus-button,
        .plus-button {
            width: 30px;
            height: 30px;
            background-color: transparentize(white, 0.7);
            border: none;
            font-size: 20px;
            font-weight: 900;
            padding: 0;
            color: inherit;
            text-align: center;
            border-radius: 5px;

            .icon {
                text-align: center;
                vertical-align: middle;
            }
            &:active {
                background-color: transparentize(white, 0.3);
            }
        }
    }
}
</style>
