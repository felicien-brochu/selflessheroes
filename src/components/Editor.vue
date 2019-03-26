<template>
<div id="editor">
  <code-mirror id="editor-text" :value="code" :options="codeMirrorConfig" v-bind:value="code" v-on:change="$emit('change', $event)" />
  <div id="top-bar">
    <button id="run-button" v-on:click="$emit('run-ai')">{{runLabel}}</button>
  </div>
</div>
</template>

<script>
import CodeMirror from './CodeMirror'
import lang from '../lang'

export default {
  components: {
    CodeMirror
  },
  props: ['code'],
  model: {
    prop: 'code',
    event: 'change'
  },
  data: function() {
    return {
      runLabel: lang.text('run_label'),
      codeMirrorConfig: {
        lineNumbers: true,
        mode: 'javascript',
        theme: 'one-dark'
      }
    }
  }
}
</script>

<style lang="scss">
#editor {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;

    #top-bar {
        display: flex;
        justify-content: flex-start;
        padding-bottom: 8px;
        padding-left: 12px;
        background-color: #191c21;
        z-index: 30;

        #run-button {
            font-family: Arial;
            z-index: 30;
            padding: 0;
            margin-top: -20px;
            font-size: 30px;
            line-height: 40px;
            border-radius: 20px;
            border-width: 0;
            width: 40px;
            height: 40px;
            background-color: rgb(240, 240, 240);
            box-shadow: 0 1px 6px 0 black;
            &:hover {
                box-shadow: 0 1px 6px 0 #656565;
            }
            &:active {
                background-color: rgb(200, 200, 200);
            }
        }
    }

    #editor-text {
        // display: flex;
        flex-grow: 1;
        // align-items: stretch;
        width: 100%;
        .CodeMirror {
            // flex-grow: 1;
            padding-top: 30px;
            height: 100%;
            width: 100%;
        }
    }
}
</style>
