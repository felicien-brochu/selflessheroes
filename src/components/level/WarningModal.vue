<template>
<modal class="errors-modal"
  :cancelable="false"
  :frameWidth="frameWidth"
  :frameHeight="frameHeight"
  :text="text"
  @close="$emit('close')"
  @confirm="$emit('confirm', $event)"
  @cancel="$emit('cancel', $event)">
  <span v-bbcode>{{text}}</span>
</modal>
</template>

<script>
import Modal from '../modal/Modal'

export default {
  components: {
    Modal
  },
  props: {
    'text': String,
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
      this.$emit('confirm')
      this.$emit('close')
    },

    cancel() {
      this.$emit('cancel')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
</style>
