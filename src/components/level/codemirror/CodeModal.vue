<template>
<modal v-bind="$props"
  ref="modal"
  @close="$emit('close')"
  @confirm="$emit('confirm', $event)"
  @cancel="$emit('cancel', $event)">

  <div class="code-modal-content"
    v-bbcode="'type'">{{text}}</div>

</modal>
</template>

<script>
import Modal from '../../modal/Modal'

export default {
  components: {
    Modal
  },
  props: {
    'text': {
      type: String,
      default: '[no-text]'
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
    }
  },

  methods: {
    confirm() {
      this.$refs.modal.confirm()
    },

    cancel() {
      this.$refs.modal.cancel()
    }
  }
}
</script>

<style lang="scss">
.code-modal-content {
    .code-segment {
        font-family: Consolas, 'DejaVu Sans Mono', monospace;
        background-color: #282C34;
        padding: 2px 4px;
        border-radius: 5px;
    }
}
</style>
