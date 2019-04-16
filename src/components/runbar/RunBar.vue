<template>
<div class="run-bar">

  <play-pause-button @play-pause="$emit('play-pause', $event)"
    :paused="worldState.paused"
    :disabled="!readyToPlay" />

  <button class="step-button"
    @click="$emit('step')"
    :disabled="!readyToPlay" />

  <button class="stop-button"
    @click="$emit('stop')"
    :disabled="!worldStarted" />

  <speed-range @change="$emit('speed-change', $event)" />
</div>
</template>

<script>
import SpeedRange from './SpeedRange'
import PlayPauseButton from './PlayPauseButton'

export default {
  components: {
    SpeedRange,
    PlayPauseButton
  },
  props: {
    'worldState': {
      type: Object,
      default: {}
    },
    'worldReady': {
      type: Boolean,
      default: false
    },
    'aiReady': {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {}
  },
  computed: {
    readyToPlay: function() {
      return this.worldReady && this.aiReady && !this.worldState.gameOver
    },
    worldStarted: function() {
      return this.worldReady && this.aiReady && this.worldState.steps > 0
    }
  }
}
</script>

<style lang="scss">
.run-bar {
    $padding-v: 12px;
    $padding-h: 5px;

    display: flex;
    justify-content: center;
    padding: $padding-v $padding-h;
    background-color: #252930;

    .speed-range {
        align-self: center;
        margin: 0 8px;
    }

    button {
        background: none;
        color: inherit;
        border: none;
        padding: 0;
        font: inherit;
        cursor: pointer;
        outline: inherit;
        width: 40px;
        height: 40px;
        border-radius: 20px;
        box-shadow: 0 1px 6px 0 black;
        margin: 0 7px;

        &:hover {
            box-shadow: 0 1px 6px 0 #656565;
        }
        &:active {
            background-color: rgb(75, 75, 75);
        }

        &:disabled {
            opacity: 0.3;
            &:hover {
                box-shadow: inherit;
            }
            &:active {
                background-color: inherit;
            }
        }
        &.step-button {
            background-image: url("/assets/images/step-button.png");
        }
        &.stop-button {
            background-image: url("/assets/images/stop-button.png");
        }
    }
}
</style>
