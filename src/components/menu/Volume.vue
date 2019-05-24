<template>
<component class="volume"
  :is="tag">
  <mute-button :volume="volume"
    @toggle-mute="toggleMute" />
  <touch-range :value="volume.volume"
    :class="{
			'inactive': volume.mute
		}"
    :min="0"
    :max="1"
    @input="setVolume" />
</component>
</template>

<script>
import TouchRange from '../inputs/TouchRange'
import MuteButton from './MuteButton'

export default {
  components: {
    TouchRange,
    MuteButton
  },
  props: {
    "tag": {
      type: String,
      default: 'div'
    },
    "volume": Object
  },
  computed: {},
  methods: {
    setVolume(volume) {
      this.volume.volume = volume
      if (volume > 0) {
        this.volume.mute = false
      }
    },

    toggleMute() {
      this.volume.mute = !this.volume.mute
    }
  }
}
</script>

<style lang="scss">
.volume {
    display: flex;
    align-items: center;

    .mute-button {
        margin-right: 10px;
    }
}
</style>
