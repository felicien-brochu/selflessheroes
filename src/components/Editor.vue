<template>
<div id="editor">
  <div>
    <code-mirror id="editor-text" :value="code" :worldReady="worldReady" :compilerException="compilerException" :disabled="playing" @change="$emit('change', $event)" />
    <div class="editor-readonly-overlay" :style="{ display: playing ? 'initial' : 'none'}"></div>
  </div>
  <div id="bottom-bar">
    <play-pause-button @play-pause="$emit('play-pause', $event)" :paused="worldState.paused" :disabled="readyToPlay" />
    <speed-range @change="$emit('speed-change', $event)" />
    <button class="step-button" @click="$emit('step')" :disabled="readyToPlay" />
    <button class="stop-button" @click="$emit('stop')" :disabled="!worldReady || !worldState.aiReady || worldState.steps < 1" />
  </div>
</div>
</template>

<script>
import CodeMirror from './codemirror/CodeMirror'
import SpeedRange from './SpeedRange'
import PlayPauseButton from './PlayPauseButton'

export default {
  components: {
    CodeMirror,
    SpeedRange,
    PlayPauseButton
  },
  props: {
    'code': {
      type: String,
      default: ''
    },
    'worldState': {
      type: Object,
      default: {}
    },
    'worldReady': {
      type: Boolean,
      default: false
    },
    'compilerException': {
      type: Error,
      default: null
    }
  },
  model: {
    prop: 'code',
    event: 'change'
  },
  data: function() {
    return {}
  },
  computed: {
    playing: function() {
      return !this.worldReady || this.worldState.steps > 0
    },
    readyToPlay: function() {
      return !this.worldReady || !this.worldState.aiReady || this.worldState.gameOver
    }
  },
  mounted: () => {
    resizeCodeMirror()
  }
}

function resizeCodeMirror() {
  let height = window.innerHeight - 86
  document.getElementsByClassName("CodeMirror")[0].style = "height: " + height + "px;"
}
window.addEventListener("resize", resizeCodeMirror)
</script>

<style lang="scss">
#editor {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #282c34;

    #bottom-bar {
        $padding-v: 12px;
        $padding-h: 5px;

        display: flex;
        justify-content: center;
        padding: $padding-v $padding-h;
        background-color: #191c21;
        z-index: 100;

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

    .editor-readonly-overlay {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 20;
        background: #282c3444;
    }

    #editor-text {
        position: relative;
        flex-grow: 1;
        .CodeMirror {
            padding-top: 20px;
            width: 100%;
        }
    }
}
</style>
