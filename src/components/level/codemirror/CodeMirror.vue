<template>
<div class="vue-codemirror-wrap"
  @mousedown="$emit('start-edit')"
  @touchstart="$emit('start-edit')">

  <modal-layer ref="modalLayer" />

  <line-cursors v-show="playing"
    ref="lineCursors"
    :debugContext="debugContext"
    :followHeroIndex="followHeroIndex"
    @select-follow-hero="$emit('select-follow-hero', $event)"
    @follow-hero-cursor-line-change="handleFollowHeroCursorLineChange" />

  <textarea></textarea>
</div>
</template>

<script>
import Vue from 'vue'
import _debounce from 'lodash.debounce'
import 'codemirror/lib/codemirror.css'
import CodeMirror from 'codemirror'
import './aiworldmode'
import LineCursors from './LineCursors'
import ScrollAnimator from '../util/ScrollAnimator'
import ModalLayer from '../../modal/ModalLayer'
import Modal from '../../modal/Modal'
import CodeModal from './CodeModal'
import ErrorsModal from './ErrorsModal'

export default {
  components: {
    LineCursors,
    ModalLayer
  },

  props: {
    'code': {
      type: String,
      default: ''
    },
    'options': {
      type: Object,
      default: function() {
        return {
          mode: 'aiworld',
          lineNumbers: true,
          theme: 'one-dark',
          viewportMargin: Infinity,

          indentUnit: 2,
          indentWithTabs: true,
          smartIndent: true,
          tabSize: 2
        }
      }
    },
    'disabled': {
      type: Boolean,
      default: false
    },
    'worldReady': {
      type: Boolean,
      default: false
    },
    'compilerExceptions': {
      type: Object
    },
    'playing': {
      type: Boolean
    },
    'debugContext': {
      type: Object
    },
    'followHeroIndex': {
      type: Number
    }
  },

  data: function() {
    return {
      skipNextChangeEvent: false
    }
  },

  beforeCreate() {
    this.exceptionMarkers = []
  },

  created() {
    this.debouncedCreateExceptionMarkers = _debounce(this.createExceptionMarkers, 2500, {
      leading: false,
      trailing: true
    })
  },

  mounted() {
    this.editor = CodeMirror.fromTextArea(this.$el.querySelector('textarea'), this.options)
    CodeMirror.commands.undo = function() {}
    CodeMirror.commands.redo = function() {}

    this.editor.setValue(this.code)
    this.editor.on('changes', this.handleEditorChange)
    this.updateExceptionMarkers(false)

    let scroll = document.getElementsByClassName('CodeMirror-scroll')[0]
    this.scrollAnimator = new ScrollAnimator(scroll, 26)
    scroll.appendChild(this.$refs.lineCursors.$el)
  },

  destroyed() {
    this.debouncedCreateExceptionMarkers.cancel()
  },

  watch: {
    code: function(newVal, oldVal) {
      var editorValue = this.editor.getValue()
      if (newVal !== editorValue) {
        this.skipNextChangeEvent = true
        var scrollInfo = this.editor.getScrollInfo()
        this.editor.setValue(newVal)
        this.editor.scrollTo(scrollInfo.left, scrollInfo.top)
      }
    },
    options: function(newOptions, oldOptions) {
      if (typeof newOptions === 'object') {
        for (var optionName in newOptions) {
          if (newOptions.hasOwnProperty(optionName)) {
            this.editor.setOption(optionName, newOptions[optionName])
          }
        }
      }
    },
    disabled: function(disabled, wasDisabled) {
      this.editor.setOption('readOnly', disabled ? 'nocursor' : false)
    },
    worldReady: function(isReady, wasReady) {
      // Refresh when ready after fonts lazy-loading
      this.editor.refresh()
    },
    compilerExceptions: function() {
      this.updateExceptionMarkers()
    },
  },

  methods: {
    clearExceptionMarkers() {
      while (this.exceptionMarkers.length > 0) {
        this.exceptionMarkers.pop().clear()
      }
    },

    handleEditorChange(cm, change) {
      if (this.skipNextChangeEvent) {
        this.skipNextChangeEvent = false
        return
      }
      if (!!this.$emit) {
        this.$emit('change', cm.getValue())
        this.$emit('input', cm.getValue())
      }
    },

    updateExceptionMarkers(delayed = true) {
      this.clearExceptionMarkers()
      if (delayed) {
        this.debouncedCreateExceptionMarkers()
      }
      else {
        this.createExceptionMarkers()
      }
    },

    createExceptionMarkers() {
      this.clearExceptionMarkers()

      for (let newException of this.compilerExceptions.fatal) {
        let boundaries = newException.statement.getTrimedCodeBoundaries()

        this.exceptionMarkers.push(this.editor.markText({
          line: boundaries.start.line,
          ch: boundaries.start.column
        }, {
          line: boundaries.end.line,
          ch: boundaries.end.column + 1
        }, {
          className: 'cm-compiler-exception'
        }))
      }
    },

    handleFollowHeroCursorLineChange(line) {
      this.scrollAnimator.showLine(line)
    },

    showCodeStateDetails(codeState) {
      if (codeState === 'code-ok') {
        this.$refs.modalLayer.addModal({
          component: Modal,
          key: 'code_state_ok_modal',
          props: {
            text: this.$text('code_state_ok_modal'),
            cancelable: false,
          }
        })
      }
      else if (codeState === 'code-not-runnable') {
        this.$refs.modalLayer.addModal({
          component: CodeModal,
          key: 'code_state_not_runnable_modal',
          props: {
            text: this.$text('code_state_not_runnable_modal'),
            cancelable: false,
          }
        })
      }
      else if (codeState === 'code-not-compilable') {
        this.$refs.modalLayer.addModal({
          component: ErrorsModal,
          key: 'code_state_not_compilable_modal',
          props: {
            compilerExceptions: this.compilerExceptions
          }
        })
      }
    }

  }
}
</script>

<style lang="scss">
.CodeMirror {
    cursor: text;

    .line-cursors-container {
        z-index: 10;
        position: absolute;
        top: 0;
        left: 0;
    }
}

.CodeMirror-lines {
    padding-top: 12px;
    padding-bottom: 30px;
}

.CodeMirror .CodeMirror-line {
    padding-left: 12px;
}

.cm-s-one-dark .cm-undefined-literal {
    border-bottom: 2px #4f5e7b solid;
    text-decoration-color: #4f5e7b;
    color: #d19a66;
}

.cm-s-one-dark .cm-compiler-exception {
    border-bottom: 2px #9f3131 solid;
}

/*
	    Name:       one-dark 1.1.1
	    Author:     Török Ádám (http://github.com/Aerobird98)
	    Original Atom One Dark Theme (https://github.com/atom/one-dark-ui & https://github.com/atom/one-dark-syntax)
	*/
/* basic */

.CodeMirror.cm-s-one-dark {
    font-family: Consolas, 'DejaVu Sans Mono', monospace;
    font-weight: 250;
    font-size: 18px;
    line-height: 26px;
    color: #abb2bf;
    background-color: #282c34;
}

.cm-s-one-dark .CodeMirror-selected {
    background-color: #3e4451;
}

.cm-s-one-dark .CodeMirror-gutter,
.cm-s-one-dark .CodeMirror-gutters {
    border: none;
    background-color: #282c34;
}

.cm-s-one-dark .CodeMirror-linenumber,
.cm-s-one-dark .CodeMirror-linenumbers {
    color: lighten(#282c34, 20%);
    background-color: lighten(#282c34, 3%);
}

.cm-s-one-dark .CodeMirror-lines {
    color: #abb2bf !important;
    background-color: transparent;
}

.cm-s-one-dark .CodeMirror-cursor {
    border-left: 2px solid #56b6c2 !important;
}

/* addon: edit/machingbrackets.js & addon: edit/matchtags.js */
.cm-s-one-dark .CodeMirror-matchingbracket,
.cm-s-one-dark .CodeMirror-matchingtag {
    border-bottom: 2px solid #56b6c2;
    color: #abb2bf !important;
    background-color: transparent;
}

.cm-s-one-dark .CodeMirror-nonmatchingbracket {
    border-bottom: 2px solid #e06c75;
    color: #abb2bf !important;
    background-color: transparent;
}

/* addon: fold/foldgutter.js */
.cm-s-one-dark .CodeMirror-foldgutter,
.cm-s-one-dark .CodeMirror-foldgutter-folded,
.cm-s-one-dark .CodeMirror-foldgutter-open,
.cm-s-one-dark .CodeMirror-foldmarker {
    border: none;
    text-shadow: none;
    color: #5c6370 !important;
    background-color: transparent;
}

/* addon: selection/active-line.js */
.cm-s-one-dark .CodeMirror-activeline-background {
    background-color: rgba(153, 187, 255, 0.04);
}

/* basic syntax */
.cm-s-one-dark .cm-header {
    color: #e06c75;
}

.cm-s-one-dark .cm-quote {
    color: #5c6370;
    font-style: italic;
}

.cm-s-one-dark .cm-negative {
    color: #e06c75;
}

.cm-s-one-dark .cm-positive {
    color: #e06c75;
}

.cm-s-one-dark .cm-strong {
    color: #d19a66;
    font-weight: bold;
}

.cm-s-one-dark .cm-header .cm-strong {
    color: #d19a66;
    font-weight: bold;
}

.cm-s-one-dark .cm-em {
    color: #c678dd;
    font-style: italic;
}

.cm-s-one-dark .cm-header .cm-em {
    color: #c678dd;
    font-style: italic;
}

.cm-s-one-dark .cm-tag {
    color: #e06c75;
}

.cm-s-one-dark .cm-attribute {
    color: #d19a66;
}

.cm-s-one-dark .cm-link {
    color: #98c379;
    border-bottom: solid 1px #98c379;
}

.cm-s-one-dark .cm-builtin {
    color: #e06c75;
}

.cm-s-one-dark .cm-keyword {
    color: #c678dd;
}

.cm-s-one-dark .cm-function {
    color: hsl(207, 82%, 66%);
}

.cm-s-one-dark .cm-def {
    color: #e5c07b;
}

.cm-s-one-dark .cm-atom {
    color: #d19a66;
}

.cm-s-one-dark .cm-number {
    color: #d19a66;
}

.cm-s-one-dark .cm-property {
    color: #56b6c2;
}

/* original: #abb2bf */
.cm-s-one-dark .cm-qualifier {
    color: #d19a66;
}

.cm-s-one-dark .cm-variable {
    color: #e06c75;
}

.cm-s-one-dark .cm-string {
    color: #98c379;
}

.cm-s-one-dark .cm-punctuation {
    color: #abb2bf;
}

.cm-s-one-dark .cm-operator {
    color: #56b6c2;
}

.cm-s-one-dark .cm-meta {
    color: #abb2bf;
}

.cm-s-one-dark .cm-bracket {
    color: #abb2bf;
    font-style: italic;
}

.cm-s-one-dark .cm-comment {
    color: #5c6370;
    font-style: italic;
}

.cm-s-one-dark .cm-error {
    color: #e06c75;
}

/* css syntax corrections */
.cm-s-one-dark .cm-m-css.cm-variable {
    color: #828997;
}

.cm-s-one-dark .cm-m-css.cm-property {
    color: #abb2bf;
}

.cm-s-one-dark .cm-m-css.cm-atom {
    color: #56b6c2;
}

.cm-s-one-dark .cm-m-css.cm-builtin {
    color: #56b6c2;
}

/* lua syntax corrections */
.cm-s-one-dark .cm-m-lua.cm-variable {
    color: #56b6c2;
}
</style>
