<template>
<div id="editor">
  <code-mirror id="editor-text" :value="code" :options="codeMirrorConfig" v-bind:value="code" v-on:change="$emit('change', $event)" />
  <div id="bottom-bar">
    <button id="run-button" v-on:click="$emit('run-ai')">{{runLabel}}</button>
    <speed-range v-on:change="$emit('speed-change', $event)" />
  </div>
</div>
</template>

<script>
import CodeMirror from './CodeMirror'
import SpeedRange from './SpeedRange'
import lang from '../lang'

export default {
  components: {
    CodeMirror,
    SpeedRange
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
  },
  mounted: () => {
    resizeCodeMirror()
  }
}

function resizeCodeMirror() {
  let height = window.innerHeight - 86
  document.getElementsByClassName("CodeMirror")[0].style = "height: " + height + "px;"
}
window.addEventListener("resize", resizeCodeMirror)
</script>

<style lang="scss">
#editor {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #282c34;

    #bottom-bar {
        $padding-v: 12px;
        $padding-h: 18px;

        display: flex;
        justify-content: flex-start;
        padding: $padding-v $padding-h;
        background-color: #191c21;
        z-index: 100;

        #run-button {
            font-family: Arial;
            z-index: 30;
            padding: 0;
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

        .speed-range {
            align-self: center;
            margin: 0 20px;
        }
    }

    #editor-text {
        position: relative;
        flex-grow: 1;
        .CodeMirror {
            padding-top: 20px;
            width: 100%;
        }
    }
}
</style>
