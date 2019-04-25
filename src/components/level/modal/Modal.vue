<template>
<div class="modal">
  <button class="close-button material-icons"
    type="button"
    :title="$text('modal_close_button')"
    @click="cancel"
    @touchstart="cancel">close</button>

  <div class="modal-content">{{text}}</div>

  <div class="button-container">
    <button type="submit"
      :title="$text('modal_confirm_button')"
      @click="confirm"
      @touchstart="confirm">{{
				$text('modal_confirm_button')
		}}</button>

    <button v-if="cancelable"
      type="button"
      :title="$text('modal_cancel_button')"
      @click="cancel"
      @touchstart="cancel">{{
				$text('modal_cancel_button')
		}}</button>
  </div>
</div>
</template>

<script>
export default {
  props: {
    'cancelable': {
      type: Boolean,
      default: true
    },
    'confirmValue': {
      default: true
    },
    'text': {
      type: String,
      default: ''
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
$main-color: #583455;
$color: white;
.modal {
    position: relative;
    padding: 49px 60px 30px;
    width: max-content;
    background-color: $main-color;
    color: $color;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    box-shadow: inset 0 0 30px 10px #00000033, 0 0 30px 10px #00000033;

    .modal-content {
        max-width: 600px;
        min-width: 300px;
        font-size: 24px;
        text-align: center;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

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
        color: $color;
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
            background-color: lighten($main-color, 10%);
            color: $color;
            border-radius: 3px;
            box-shadow: inset 0 0 10px 3px #0003, 0 0 10px 0 #0003;

            &:hover:not(:active) {
                background-color: lighten($main-color, 12%);
            }
        }
    }
}
</style>
