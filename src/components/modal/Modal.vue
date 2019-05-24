<template>
<transition :name="transition"
  appear>
  <div :class="['modal', `modal-${type}`]"
    :style="{
		maxWidth: `${maxWidth}px`,
		maxHeight: `${maxHeight}px`
	}">
    <button class="close-button mdi mdi-close"
      v-if="!hideButtons && !hideCloseButton"
      type="button"
      :title="$text('modal_close_button')"
      @click="cancel"
      @touchstart="cancel" />

    <div class="modal-content"
      :style="{
			maxWidth: `${maxWidth - 120}px`,
			maxHeight: `${maxHeight - 160}px`
		}">
      <slot>{{text}}</slot>
    </div>

    <div class="button-container"
      v-if="!hideButtons">

      <button v-if="cancelable"
        type="button"
        :title="cancelButtonLabel"
        @click="cancel"
        @touchstart="cancel">{{
					cancelButtonLabel
				}}</button>

      <button type="submit"
        :title="confirmButtonLabel"
        @click="confirm"
        @touchstart="confirm">{{
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
      return transition
    }
  },

  methods: {
    confirm() {
      this.$emit('confirm', this.confirmValue)
      this.$emit('close')
    },

    cancel() {
      this.$emit('cancel', this.confirmValue)
      this.$emit('close')
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
    box-shadow: inset 0 0 30px 10px #00000033, 0 0 100px 10px #000000aa;

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
            box-shadow: inset 0 0 10px 3px #0003, 0 0 10px 0 #0003;
        }
    }

    &.pop-enter-active {
        transition: all 0.20s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    &.pop-leave-active {
        transition: all 0.15s ease;
    }

    &.pop-enter {
        transform: translate(-50%, -50%) scale(0.5) rotate(10deg);
        opacity: 0;
    }

    &.pop-leave-to {
        transform: translate(-50%, -50%) scale(0) rotate(10deg);
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
        transform: translateX(-50%) translateY(calc(-50% - 50px));
    }
}

.modal-content {
    font-size: 24px;
    text-align: center;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: auto;
}
</style>
