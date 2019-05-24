<template>
<button @click="toggleMute"
  :title="title"
  :class="[
		'mute-button',
		'mdi',
		buttonIcon
		]" />
</template>

<script>
export default {
  props: {
    "volume": Object
  },
  data: function() {
    return {}
  },

  computed: {
    buttonIcon: function() {
      if (this.volume.mute || this.volume.volume === 0) {
        return 'mdi-volume-off'
      }
      else if (this.volume.volume < 0.25) {
        return 'mdi-volume-low'
      }
      else if (this.volume.volume < 0.75) {
        return 'mdi-volume-medium'
      }
      else {
        return 'mdi-volume-high'
      }
    },
    title: function() {
      if (this.volume.mute) {
        return this.$text("mute_button_unmute")
      }
      else {
        return this.$text("mute_button_mute")
      }
    }
  },

  methods: {
    toggleMute() {
      this.$emit('toggle-mute')
    }
  }
}
</script>

<style lang="scss">
.mute-button {
    background: none;
    border: none;
    outline: none;
    pointer-events: all;
    cursor: pointer;
    font-size: 38px;
    color: transparentize(white, 0.2);
    padding: 0;

    &:hover {
        color: white;
    }
}
</style>
