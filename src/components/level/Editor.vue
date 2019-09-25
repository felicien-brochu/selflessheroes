<template>
<div class="editors-container">

  <div class="editor"
    ref="editor">

    <modal-layer ref="modalLayer" />

    <template v-if="worldReady">
      <transition name="slide"
        appear>
        <variable-debugger v-if="playing && followHeroIndex >= 0 && compilerConfig && compilerConfig.variables > 0"
          :variables="followHeroVariables" />
      </transition>

      <transition name="switch"
        appear>
        <code-mirror v-if="editorType === 'code'"
          ref="codeEditor"
          key="code-editor"
          :code="code"
          :worldReady="worldReady"
          :playing="playing"
          :compilerExceptions="compilerExceptions"
          :debugContext="debugContext"
          :followHeroIndex="followHeroIndex"
          @change="handleCodeMirrorChange"
          @select-follow-hero="$emit('select-follow-hero', $event)"
          @start-edit="$emit('start-edit')" />

        <graph-editor v-else-if="editorType === 'graph'"
          ref="graphEditor"
          key="graph-editor"
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
          @start-edit="$emit('start-edit')"
          @change-preferred-width="$emit('change-preferred-width', $event)" />
      </transition>

    </template>
  </div>

  <editor-bar :worldReady="worldReady"
    :editorType="editorType"
    :code="code"
    :codeHistory="codeHistory"
    :codeState="codeState"
    @undo="$emit('undo')"
    @redo="$emit('redo')"
    @remove-code="removeCode"
    @switch-editor="handleSwitchEditor"
    @code-state-click="handleCodeStateClick"
    @objective-click="handleObjectiveClick" />
</div>
</div>
</template>

<script>
import CodeMirror from './codemirror/CodeMirror'
import GraphEditor from './grapheditor/GraphEditor'
import EditorBar from './editorbar/EditorBar'
import VariableDebugger from './variabledebugger/VariableDebugger'
import ModalLayer from '../modal/ModalLayer'
import Modal from '../modal/Modal'


export default {
  components: {
    CodeMirror,
    GraphEditor,
    EditorBar,
    VariableDebugger,
    ModalLayer
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

  data: function() {
    return {
      codeState: 'code-ok'
    }
  },

  watch: {
    compilerExceptions: function() {
      let state = 'code-ok'
      if (!this.compilerExceptions || this.compilerExceptions.fatal.length > 0) {
        state = 'code-not-compilable'
      }
      else if (this.compilerExceptions && this.compilerExceptions.undefinedLiterals.length > 0) {
        state = 'code-not-runnable'
      }
      this.codeState = state
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
    },

    handleSwitchEditor(editorType) {
      if (editorType === 'graph' && this.codeState === 'code-not-compilable') {
        this.$refs.modalLayer.addModal({
          component: Modal,
          key: 'switch-editor-warning',
          props: {
            text: this.$text('switch_editor_warning'),
            cancelable: true,
            confirmValue: editorType
          },
          handlers: {
            confirm: this.confirmSwitchEditor
          }
        })
      }
      else {
        this.$emit('change-type', editorType)
      }
    },

    confirmSwitchEditor(editorType) {
      this.$emit('change-type', editorType)
    },

    handleCodeStateClick(codeState) {
      this.$refs.codeEditor.showCodeStateDetails(codeState)
    },

    handleObjectiveClick() {
      this.$emit('objective-click')
    }
  }
}
</script>

<style lang="scss">
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
            position: absolute;
            top: 0;
            right: 100%;
            margin: 60px 0 0;
        }

        .vue-codemirror-wrap {
            z-index: 5;
            height: 100%;
            position: relative;
            flex-grow: 1;
            .CodeMirror {
                width: 100%;
                height: 100%;
            }
        }

        .graph-editor {
            position: absolute;
            top: 0;
        }
    }

    .editor-bar {
        z-index: 100;
        box-shadow: 0 2px 8px 0 rgba(15, 17, 20, 0.7);
    }
}
</style>
