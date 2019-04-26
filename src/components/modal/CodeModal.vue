<template>
<modal v-bind="$props"
  @close="$emit('close')"
  @confirm="$emit('confirm', $event)"
  @cancel="$emit('cancel', $event)">

  <code-template class="modal-content"
    :template="text" />

</modal>
</template>

<script>
import Modal from './Modal'
import CodeTemplate from './CodeTemplate'

export default {
  components: {
    CodeTemplate,
    Modal
  },
  props: {
    'text': {
      type: String,
      default: 'no-text'
    },
    'cancelable': {
      type: Boolean,
      default: true
    },
    'confirmValue': {
      default: true
    }
  },

  methods: {
    proxyChildEvent(eventName, eventArgs) {
      this.$emit(eventName, ...eventArgs)
    }
  }
}
</script>

<style lang="scss">
</style>
