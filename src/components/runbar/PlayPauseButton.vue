<template>
<button @click="toggle"
  :class="{
		'play-pause-button': true,
		'pause-button': !paused,
		'play-button': paused
		}" />
</template>

<script>
export default {
  props: {
    paused: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {}
  },
  methods: {
    toggle() {
      this.$emit('play-pause', this.paused)
    }
  }
}
</script>

<style lang="scss">
button.play-pause-button {
    &.play-button {
        background-image: url("/assets/images/play-button.png") !important;
    }
    &.pause-button {
        background-image: url("/assets/images/pause-button.png") !important;
    }
}
</style>
