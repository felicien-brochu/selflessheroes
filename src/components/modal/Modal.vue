<template>
<transition :name="transition"
  appear>
  <div :class="cssClasses"
    :style="{
				maxWidth: `${maxWidth}px`,
				maxHeight: internalScroll ? `${maxHeight}px` : 'none'
			}">

    <button class="close-button mdi mdi-close"
      v-if="!hideButtons && !hideCloseButton"
      type="button"
      :title="$text('modal_close_button')"
      @click="cancel()" />

    <div class="modal-content"
      :style="{
				maxWidth: `${maxWidth - 120}px`
			}">
      <slot>{{text}}</slot>
    </div>

    <div class="button-container"
      v-if="!hideButtons">

      <button v-if="cancelable"
        type="button"
        :title="cancelButtonLabel"
        @click="cancel()">{{
					cancelButtonLabel
				}}</button>

      <button type="submit"
        :title="confirmButtonLabel"
        @click="confirm()">{{
				confirmButtonLabel
			}}</button>

    </div>
  </div>
</transition>
</template>

<script>
export default {
  props: {
    'text': {
      type: String,
      default: '[no-text]'
    },
    'type': {
      type: String,
      default: 'warning'
    },
    'cancelable': {
      type: Boolean,
      default: true
    },
    'confirmValue': {
      default: true
    },
    'frameWidth': {
      type: Number,
      default: window.innerWidth
    },
    'frameHeight': {
      type: Number,
      default: window.innerHeight
    },
    'hideTransition': {
      type: Boolean,
      default: false
    },
    'internalScroll': {
      type: Boolean,
      default: false
    },
    'hideButtons': {
      type: Boolean,
      default: false
    },
    'hideCloseButton': {
      type: Boolean,
      default: false
    },
    'confirmLabel': {
      type: String,
      default: ''
    },
    'cancelLabel': {
      type: String,
      default: ''
    },
  },

  computed: {
    cssClasses: function() {
      let classes = ['modal', `modal-${this.type}`]
      if (this.internalScroll) {
        classes.push('internal-scroll')
      }
      return classes
    },
    maxWidth: function() {
      let maxWidth = Math.min(720, this.frameWidth)
      maxWidth = Math.max(420, maxWidth)
      return maxWidth
    },
    maxHeight: function() {
      return this.frameHeight
    },
    confirmButtonLabel: function() {
      return this.confirmLabel.length > 0 ? this.confirmLabel : this.$text('modal_confirm_button')
    },
    cancelButtonLabel: function() {
      return this.cancelLabel.length > 0 ? this.cancelLabel : this.$text('modal_cancel_button')
    },
    transition: function() {
      let transition = ''
      switch (this.type) {
        case 'info':
          transition = 'fade-slide'
          break
        case 'warning':
          transition = 'pop'
        default:
          transition = 'pop'
      }

      if (this.hideTransition) {
        transition = 'hide-transition'
      }
      return transition
    }
  },

  methods: {
    confirm(confirmValue = this.confirmValue) {
      this.$emit('confirm', confirmValue)
      this.$emit('close')
    },

    cancel(confirmValue = this.confirmValue) {
      this.$emit('close')
      this.$emit('cancel', confirmValue)
    }
  }
}
</script>

<style lang="scss">
@mixin modal-type($modal-color, $text-color) {

    background-color: $modal-color;
    color: $text-color;

    .close-button {
        color: $text-color;
    }

    .button-container button {
        background-color: lighten($modal-color, 10%);
        color: $text-color;

        &:hover:not(:active) {
            background-color: lighten($modal-color, 12%);
        }
    }
}

.modal-warning {
    @include modal-type(#583455, white);
}
.modal-info {
    @include modal-type(#3C404A, white);
}

.modal {
    position: relative;
    padding: 37px 50px 30px;
    min-width: 420px;
    box-sizing: border-box;
    width: max-content;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    box-shadow: inset 0 0 30px 10px rgba(0,0,0,0.2), 0 0 100px 10px rgba(0,0,0,0.66);

    button {
        background: none;
        border: none;
        outline: none;
        padding: 0;
        cursor: pointer;
    }

    .close-button {
        position: absolute;
        top: 0;
        right: 0;
        margin: 14px 16px;
        width: 24px;
        height: 24px;
        font-size: 24px;
        line-height: 24px;
    }

    .button-container {
        min-width: 300px;
        display: flex;
        justify-content: space-evenly;
        margin-top: 42px;

        button {
            font-weight: 500;
            min-width: 100px;
            font-size: 21px;
            padding: 9px 20px;
            border-radius: 3px;
            box-shadow: inset 0 0 10px 3px rgba(0,0,0,0.2), 0 0 10px 0 rgba(0,0,0,0.2);
        }
    }

    &.pop-enter-active {
        transition: all 0.20s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    &.pop-leave-active {
        transition: all 0.15s ease;
    }

    &.pop-enter {
        transform: scale(0.5) rotate(10deg);
        opacity: 0;
    }

    &.pop-leave-to {
        transform: scale(0) rotate(10deg);
        opacity: 0;
    }

    &.fade-slide-enter-active {
        transition: all 0.25s ease-out;
    }

    &.fade-slide-leave-active {
        transition: all 0.2s ease-out;
    }

    &.fade-slide-enter,
    &.fade-slide-leave-to {
        opacity: 0;
        transform: translateY(-50px);
    }

    &.hide-transition-enter-active {
        transition: all 0.2s step-end;
        display: none !important;
    }

    &.hide-transition-leave-active {
        transition: all 0.25s step-start;
    }

    &.hide-transition-leave-to {
        opacity: 0;
        transform: translateY(-50px);
    }
}

.modal-content {
    font-size: 24px;
    text-align: center;
    white-space: pre-wrap;
    word-wrap: break-word;

    .icon {
        width: 30px;
        height: 30px;
        display: inline-block;
        background-size: cover;
        vertical-align: bottom;
    }
}

.internal-scroll {
    .modal-content {
        overflow: auto;
    }
}
</style>
