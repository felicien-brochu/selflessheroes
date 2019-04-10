<template>
<div id="editor-container">
  <div id="editors">
    <code-mirror class="code-editor"
      :value="code"
      :worldReady="worldReady"
      :compilerException="compilerException"
      :disabled="playing"
      @change="$emit('change', $event)" />
    <graph-editor id="graph-editor"
      :code="code"
      :compilerConfig="compilerConfig"
      :worldReady="worldReady" />
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
import GraphEditor from './grapheditor/GraphEditor'
import RunBar from './runbar/RunBar'

function resizeCodeMirror() {
  let height = window.innerHeight - 93
  // document.getElementsByClassName("CodeMirror")[0].style.height = `${height}px`
  document.getElementById("editors").style.height = `${height}px`
}
window.addEventListener("resize", resizeCodeMirror)

export default {
  components: {
    CodeMirror,
    GraphEditor,
    RunBar
  },
  props: {
    'code': {
      type: String,
      default: ''
    },
    'compilerConfig': {
      type: Object,
      default: null
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
</script>

<style lang="scss">
#editor-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding-left: 1px;

    #editors {
        flex-grow: 1;

        .editor-readonly-overlay {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            right: 0;
            z-index: 20;
            background: none;
            pointer-events: none;
        }

        .code-editor {
            // display: none;
            z-index: 5;
            height: 100%;
            position: relative;
            flex-grow: 1;
            .CodeMirror {
                width: 100%;
                height: 100%;
            }
        }

        #graph-editor {
            display: none;
        }
    }

    #run-bar {
        z-index: 100;
    }
}
</style>
