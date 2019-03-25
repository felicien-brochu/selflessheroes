<template>
<div id="editor">
  <div id="top-bar">
    <button id="run-button" v-on:click="handleRunClick">{{runLabel}}</button>
  </div>
  <textarea id="editor-text">
return {
	type: 'move',
	x: 1,
	y: 1
}
	</textarea>
</div>
</template>

<script>
import 'codemirror/lib/codemirror.css'
import '../css/one-dark.css';

import CodeMirror from 'codemirror'
import js from 'codemirror/mode/javascript/javascript'
import lang from '../lang'

export default {
  data: function() {
    return {
      runLabel: lang.text('run_label')
    }
  },
  components: {},
  mounted: function() {
    let container = document.getElementById('editor-text')
    this.editor = CodeMirror.fromTextArea(container, {
      lineNumbers: true,
      mode: 'javascript',
      theme: 'one-dark',
    })
  },
  methods: {
    handleRunClick(e) {
      window.game.scene.keys.GameScene.runAI(this.editor.getValue())
    }
  }
}
</script>

<style lang="scss">
#editor {
    height: 100%;

    #top-bar {
        display: flex;
        justify-content: flex-end;
        padding-top: 8px;
        padding-right: 12px;
        background-color: #191c21;

        #run-button {
            font-family: Arial;
            z-index: 30;
            padding: 0;
            margin-bottom: -20px;
            font-size: 30px;
            line-height: 40px;
            border-radius: 20px;
            border-width: 0;
            width: 40px;
            height: 40px;
            background-color: rgb(240, 240, 240);
            &:hover {
                background-color: rgb(220, 220, 220);
            }
            &:active {
                background-color: rgb(200, 200, 200);
            }
        }
    }

    .CodeMirror {
        padding-top: 30px;
        height: 100%;
        width: 100%;
    }
}
</style>
