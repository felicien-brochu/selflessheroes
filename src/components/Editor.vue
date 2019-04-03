<template>
<div id="editor">
  <div>
    <code-mirror id="editor-text"
      :value="code"
      :worldReady="worldReady"
      :compilerException="compilerException"
      :disabled="playing"
      @change="$emit('change', $event)" />
    <div class="editor-readonly-overlay"
      :style="{ display: playing ? 'initial' : 'none'}"></div>
  </div>
  <run-bar id="run-bar"
    :worldReady="worldReady"
    :aiReady="aiReady"
    :worldState="worldState"
    @play-pause="$emit('play-pause', $event)"
    @speed-change="$emit('speed-change', $event)"
    @step="$emit('step')"
    @stop="$emit('stop')" />
</div>
</template>

<script>
import CodeMirror from './codemirror/CodeMirror'
import RunBar from './runbar/RunBar'

export default {
  components: {
    CodeMirror,
    RunBar
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
    'aiReady': {
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

    .editor-readonly-overlay {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 20;
        background: #282c3444;
        pointer-events: none;
    }

    #editor-text {
        position: relative;
        flex-grow: 1;
        .CodeMirror {
            padding-top: 20px;
            width: 100%;
        }
    }

    #run-bar {
        z-index: 100;
    }
}
</style>
