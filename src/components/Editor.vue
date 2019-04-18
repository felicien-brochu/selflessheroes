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
        @change="handleCodeMirrorChange" />
      <graph-editor v-else-if="editorType === 'graph'"
        id="graph-editor"
        :code="code"
        :compilerConfig="compilerConfig"
        :worldReady="worldReady"
        @code-change="handleGraphCodeChange" />
      <div class="editor-readonly-overlay"
        v-show="playing"></div>
    </template>
  </div>

  <editor-bar :worldReady="worldReady"
    :editorType="editorType"
    :code="code"
    :compilerExceptions="compilerExceptions"
    @remove-code="removeCode"
    @switch-editor="switchEditor" />
</div>
</div>
</template>

<script>
import CodeMirror from './codemirror/CodeMirror'
import GraphEditor from './grapheditor/GraphEditor'
import EditorBar from './editorbar/EditorBar'

function resizeCodeMirror() {
  let height = window.innerHeight - 93
  document.getElementById("editors").style.height = `${height}px`
}
window.addEventListener("resize", resizeCodeMirror)

export default {
  components: {
    CodeMirror,
    GraphEditor,
    EditorBar
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
    'worldReady': {
      type: Boolean,
      default: false
    },
    'playing': {
      type: Boolean,
      default: false
    },
    'compilerExceptions': {
      type: Object
    }
  },
  data: function() {
    return {
      editorType: 'graph'
    }
  },
  mounted: () => {
    resizeCodeMirror()
  },
  methods: {
    handleCodeMirrorChange(code) {
      this.$emit('code-change', code, 'code-mirror')
    },

    handleGraphCodeChange(code) {
      this.$emit('code-change', code, 'graph')
    },

    removeCode() {
      this.$emit('code-change', '', 'editor-bar')
    },

    switchEditor(editorType) {
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
    background-color: #282c34;

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

    .editor-bar {
        z-index: 100;
        box-shadow: 0 2px 8px 0 rgba(15, 17, 20, 0.7);
    }
}
</style>
