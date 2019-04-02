<template>
<div class='vue-codemirror-wrap'>
  <textarea></textarea>
</div>
</template>

<script>
import Vue from 'vue'
import 'codemirror/lib/codemirror.css'
import CodeMirror from 'codemirror'
import './aiworldmode'

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: function() {
        return {
          mode: 'aiworld',
          lineNumbers: true,
          theme: 'one-dark',
          viewportMargin: Infinity
        }
      }
    },
    worldReady: {
      type: Boolean,
      default: false
    },
    compilerException: {
      type: Error,
      default: null
    }
  },
  data: function() {
    return {
      skipNextChangeEvent: false
    }
  },
  mounted: function() {
    var _this = this
    this.editor = CodeMirror.fromTextArea(this.$el.querySelector('textarea'), this.options)
    this.editor.setValue(this.value)
    this.editor.on('change', function(cm) {
      if (_this.skipNextChangeEvent) {
        _this.skipNextChangeEvent = false
        return
      }
      if (!!_this.$emit) {
        _this.$emit('change', cm.getValue())
        _this.$emit('input', cm.getValue())
      }
    })
  },
  watch: {
    value: function(newVal, oldVal) {
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
    worldReady: function(isReady, wasReady) {
      // Refresh when ready for fonts lazy-loading
      this.editor.refresh()
    },
    compilerException: function(newException, oldException) {
      if (this.errorTimeout >= 0) {
        clearTimeout(this.errorTimeout)
        this.errorTimeout = -1
      }

      if (this.exceptionMarker) {
        this.exceptionMarker.clear()
      }
      if (newException) {
        this.errorTimeout = setTimeout(() => {
          if (this.exceptionMarker) {
            this.exceptionMarker.clear()
          }
          if (this.compilerException) {
            let boundaries = newException.statement.getTrimedCodeBoundaries()
            // console.log("####BOUND;", boundaries, `'${newException.statement.code.join('')}'`, newException.statement)
            this.exceptionMarker = this.editor.markText({
              line: boundaries.start.line,
              ch: boundaries.start.column
            }, {
              line: boundaries.end.line,
              ch: boundaries.end.column + 1
            }, {
              className: 'compiler-exception'
            })
          }
        }, 3000)
      }
      else {
        if (this.exceptionMarker) {
          this.exceptionMarker.clear()
        }
      }
    }
  },
  beforeDestroy: function() {
    if (this.editor) {
      this.editor.toTextArea()
    }
  }
}
</script>

<style>
.compiler-exception {
  text-decoration: underline;
  text-decoration-style: double;
  text-decoration-skip: spaces;
  text-decoration-color: rgb(159, 49, 49);
}

/*
	    Name:       one-dark 1.1.1
	    Author:     Török Ádám (http://github.com/Aerobird98)
	    Original Atom One Dark Theme (https://github.com/atom/one-dark-ui & https://github.com/atom/one-dark-syntax)
	*/
/* basic */


.cm-s-one-dark {
  font-family: Consolas, 'DejaVu Sans Mono', monospace;
  font-weight: 250;
  font-size: 14px;
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
  color: #5c6370 !important;
  background-color: transparent;
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

/* original:  #d19a66; */
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

/* original: #abb2bf */
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
