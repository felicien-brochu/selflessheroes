<template>
<a class="external-link link-button"
  :href="href"
  @click="onClick"
  target="_blank">
  <slot /><i class="mdi mdi-arrow-right-circle" /></a>
</template>

<script>
export default {
  props: {
    'href': {
      type: String
    }
  },

  methods: {
    onClick(e) {
      if (IS_ELECTRON) {
        e.preventDefault()
        const electronWindow = require('electron').remote.getCurrentWindow()
        electronWindow.openLink(this.href)
      }
    }
  }
}
</script>

<style lang="scss">
.external-link {}
</style>
