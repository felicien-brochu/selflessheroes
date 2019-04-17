<template>
<div id="editor-container">
  <div id="editors">
    <template v-if="this.worldReady">
      <code-mirror v-if="editorType === 'code'"
        class="code-editor"
        :code="code"
        :worldReady="worldReady"
        :compilerExceptions="compilerExceptions"
        :disabled="playing"
        @change="$emit('change', $event)" />
      <graph-editor v-else-if="editorType === 'graph'"
        id="graph-editor"
        :code="code"
        :compilerConfig="compilerConfig"
        :worldReady="worldReady"
        @code-change="handleGraphCodeChange" />
      <div class="editor-readonly-overlay"
        :style="{ display: playing ? 'initial' : 'none'}"></div>
    </template>
  </div>
  <run-bar id="run-bar"
    :worldReady="worldReady"
    :aiReady="aiReady"
    :worldState="worldState"
    :editorType="editorType"
    @play-pause="$emit('play-pause', $event)"
    @speed-change="$emit('speed-change', $event)"
    @step="$emit('step')"
    @stop="$emit('stop')"
    @switch-editor="handleSwitchEditor" />
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
    'compilerExceptions': {
      type: Object,
      default: null
    }
  },
  data: function() {
    return {
      editorType: 'graph'
    }
  },
  computed: {
    playing: function() {
      return !this.worldReady || this.worldState.steps > 0
    }
  },
  mounted: () => {
    resizeCodeMirror()
  },
  methods: {
    handleGraphCodeChange(code) {
      this.$emit('change', code)
    },

    handleSwitchEditor(editorType) {
      this.editorType = editorType
    }
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
            z-index: 5;
            height: 100%;
            position: relative;
            flex-grow: 1;
            .CodeMirror {
                width: 100%;
                height: 100%;
            }
        }

        #graph-editor {}
    }

    #run-bar {
        z-index: 100;
        box-shadow: 0 2px 8px 0 rgba(15, 17, 20, 0.7);
    }
}
</style>
