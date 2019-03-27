<template>
<div id="editor">
  <code-mirror id="editor-text" :value="code" :options="codeMirrorConfig" v-bind:value="code" v-on:change="$emit('change', $event)" />
  <div id="bottom-bar">
    <button id="run-button" v-on:click="$emit('run-ai')">{{runLabel}}</button>
    <touch-range :min="1" :max="4" :step="1" v-model="speed" />
  </div>
</div>
</template>

<script>
import CodeMirror from './CodeMirror'
import TouchRange from './TouchRange'
import lang from '../lang'

export default {
  components: {
    CodeMirror,
    TouchRange
  },
  props: ['code'],
  model: {
    prop: 'code',
    event: 'change'
  },
  data: function() {
    return {
      speed: 1,
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

    #bottom-bar {
        $padding-v: 8px;
        $padding-h: 12px;

        display: flex;
        justify-content: flex-start;
        padding: $padding-v $padding-h;
        background-color: #191c21;
        z-index: 100;

        #run-button {
            font-family: Arial;
            z-index: 30;
            padding: 0;
            margin-top: -20px - $padding-v;
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

        input[type=range] {
            margin: -19px 50px 10px;
            align-self: center;
        }
    }

    #editor-text {
        flex-grow: 1;
        width: 100%;
        .CodeMirror {
            padding-top: 30px;
            height: 100%;
            width: 100%;
        }
    }
}
</style>
