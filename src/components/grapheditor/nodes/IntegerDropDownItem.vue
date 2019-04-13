<template>
<li :class="{
	'drop-down-item': true,
	'integer-drop-down-item': true,
	'selected': selected
	}"
  @mousedown="handleSelectValue">
  <div class="integer-input">
    <div class="number">
      {{integer}}
    </div>
    <div class="button-container">
      <button class="plus-button"
        @mousedown="increment"><span class="icon">⯅</span></button>
      <button class="minus-button"
        @mousedown="decrement"><span class="icon">⯆</span></button>
    </div>
  </div>
</li>
</template>

<script>
import IntegerLiteral from '../../../world/ai/compile/statements/literals/IntegerLiteral'
export default {
  props: {
    'value': {
      type: Object,
      default: null
    },
    'max': {
      type: Number,
      default: 99
    },
    'selected': {
      type: Boolean,
      default: false
    },
    'label': {
      type: String,
      default: 'item'
    },
    'icon': {
      type: String
    }
  },
  data: function() {
    return {
      integer: this.value ? this.value.value : 0,
    }
  },
  methods: {
    increment(e) {
      this.integer = (this.integer + 1) % (this.max + 1)
      e.stopPropagation()
    },
    decrement(e) {
      let number = this.integer - 1
      if (number < 0) {
        number = this.max
      }
      this.integer = number
      e.stopPropagation()
    },

    handleSelectValue() {
      let value = new IntegerLiteral(null)
      value.value = this.integer
      this.$emit('select-value', value)
    }
  }
}
</script>

<style lang="scss">
@import '../constants';

.integer-drop-down-item {
    justify-content: center;

    .integer-input {
        display: flex;
        background-color: transparentize(white, 0.6);
        border-radius: 3px;
        .number {
            text-align: center;
            width: 36px;
        }
        .button-container {
            display: flex;
            flex-direction: column;
            width: 20px;

            .minus-button,
            .plus-button {
                width: 20px;
                height: 10px;
                background-color: transparentize(white, 0.4);
                border: none;
                font-size: 11px;
                padding: 0;
                color: inherit;
                &:active {
                    background-color: transparentize(white, 0.3);
                }
            }

            .plus-button {
                border-radius: 0 3px 0 0;
                margin-bottom: 2px;
                line-height: 10px;

                .icon {
                    vertical-align: baseline;
                }
            }
            .minus-button {
                border-radius: 0 0 3px 0;
                line-height: 0;

                .icon {
                    vertical-align: super;
                }
            }
        }
    }
}
</style>
