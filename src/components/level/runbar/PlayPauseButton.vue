<template>
<button @click="toggle"
  :class="{
		'play-pause-button': true,
		'pause-button': !paused,
		'play-button': paused
	}"
  :title="paused ? $text('run_bar_play_button') : $text('run_bar_pause_button')" />
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
        background-image: url("./images/play-button.png") !important;
    }
    &.pause-button {
        background-image: url("./images/pause-button.png") !important;
    }
}
</style>
