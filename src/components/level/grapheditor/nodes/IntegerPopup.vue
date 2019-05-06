<template>
<div :class="['popup', 'integer-popup', colorClass]">
  <div ref="input"
    class="integer-input"
    @mousedown="handlePopupClick"
    @touchstart="handlePopupTouchStart">

    <button class="minus-button mdi mdi-minus"
      @mousedown="decrement"
      @touchstart="decrement" />
    <!--⯆-->
    <span ref="number"
      class="number">
      {{integer}}
    </span>

    <button class="plus-button mdi mdi-plus"
      @mousedown="increment"
      @touchstart="increment" />
    <!--⯅-->

  </div>
</div>
</template>

<script>
import Popup from './Popup'
import IntegerLiteral from '../../../../world/ai/compile/statements/literals/IntegerLiteral'

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
    },

    handlePopupTouchStart(e) {
      e.preventDefault()
      this.handlePopupClick(e)
    },

    handlePopupClick(e) {
      if (e.target === this.$refs.input || e.target === this.$refs.number) {
        this.close()
      }
    }
  }

}
</script>

<style lang="scss">
@import '../../constants';

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
            font-weight: 900;
            padding: 0;
            color: inherit;
            text-align: center;
            border-radius: 5px;
            line-height: 30px;
            font-size: 21px;

            &:active {
                background-color: transparentize(white, 0.6);
            }
        }

        .minus-button i {
            font-size: 20px;
        }
        .plus-button i {
            font-size: 24px;
        }
    }
}
</style>
