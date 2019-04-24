<template>
<div class="editors-container">
  <div class="editor"
    ref="editor">
    <template v-if="this.worldReady">

      <variable-debugger :class="{'hidden': !playing || followHeroIndex < 0}"
        :variables="followHeroVariables" />

      <code-mirror v-if="editorType === 'code'"
        class="code-editor"
        :code="code"
        :worldReady="worldReady"
        :playing="playing"
        :compilerExceptions="compilerExceptions"
        :debugContext="debugContext"
        :followHeroIndex="followHeroIndex"
        @change="handleCodeMirrorChange"
        @select-follow-hero="$emit('select-follow-hero', $event)" />

      <graph-editor v-else-if="editorType === 'graph'"
        id="graph-editor"
        :masterCode="code"
        :codeSource="codeSource"
        :compilerConfig="compilerConfig"
        :worldReady="worldReady"
        :playing="playing"
        :hidePalette="playing"
        :debugContext="debugContext"
        :followHeroIndex="followHeroIndex"
        @code-change="handleGraphCodeChange"
        @select-follow-hero="$emit('select-follow-hero', $event)"
        @start-edit="$emit('start-edit')" />

    </template>
  </div>

  <editor-bar :worldReady="worldReady"
    :editorType="editorType"
    :code="code"
    :codeHistory="codeHistory"
    :compilerExceptions="compilerExceptions"
    @undo="$emit('undo')"
    @redo="$emit('redo')"
    @remove-code="removeCode"
    @switch-editor="$emit('change-type', $event)" />
</div>
</div>
</template>

<script>
import CodeMirror from './codemirror/CodeMirror'
import GraphEditor from './grapheditor/GraphEditor'
import EditorBar from './EditorBar'
import VariableDebugger from './variabledebugger/VariableDebugger'


export default {
  components: {
    CodeMirror,
    GraphEditor,
    EditorBar,
    VariableDebugger
  },
  props: {
    'code': {
      type: String,
      default: ''
    },
    'codeSource': {
      type: String
    },
    'codeHistory': {
      type: Object
    },
    'compilerConfig': {
      type: Object
    },
    'worldReady': {
      type: Boolean,
      default: false
    },
    'playing': {
      type: Boolean,
      default: false
    },
    'debugContext': {
      type: Object
    },
    'followHeroIndex': {
      type: Number,
      default: -1
    },
    'compilerExceptions': {
      type: Object
    },
    'editorType': {
      type: String
    }
  },

  computed: {
    followHeroVariables: function() {
      let variables = null
      if (this.followHeroIndex >= 0 && this.debugContext) {
        variables = this.debugContext.heroes[this.followHeroIndex].variables
      }
      return variables
    }
  },

  mounted() {
    this.resizeEditor()
    window.addEventListener("resize", this.resizeEditor)
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.resizeEditor)
  },

  methods: {
    handleCodeMirrorChange(code) {
      this.$emit('code-change', code, 'code')
    },

    handleGraphCodeChange(code, correction) {
      let source = correction ? 'graph-correction' : 'graph'
      this.$emit('code-change', code, source)
    },

    resizeEditor() {
      let height = window.innerHeight - 93
      this.$refs.editor.style.height = `${height}px`
    },

    removeCode() {
      this.$emit('code-change', '', 'editor-bar')
    }
  }
}
</script>

<style lang="scss">
@import './constants';

.editors-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding-left: 1px;
    color: #abb2bf;
    background-color: #282c34;

    .editor {
        position: relative;
        flex-grow: 1;

        .variable-debugger {
            animation: slide-left 0.5s ease;
            position: absolute;
            top: 0;
            right: 100%;
            margin: 40px 0 0;

            &.hidden {
                animation: slide-right 0.15s ease;
                transform: translate(100%);
            }
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
