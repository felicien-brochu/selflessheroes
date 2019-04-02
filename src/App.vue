<template>
<div id="app">
  <world @world-state-change="worldState = $event" @ready="handleWorldReady" />
  <resize-split-pane split-to="columns" @resize="handleEditorResize" :allow-resize="true" :size="editorWidth" :min-size="320" units="pixels" resizerColor="#4b5261" primary="second">
    <div slot="firstPane" />
    <editor slot="secondPane" v-model="code" :worldState="worldState" :worldReady="worldReady" :compilerException="compilerException" @change="handleCodeChange" @play-pause="handlePlayPause" @speed-change="handleSpeedChange" @step="handleStep" @stop="handleStop" />
  </resize-split-pane>
</div>
</template>

<script>
import World from './components/World'
import Editor from './components/Editor'
import ResizeSplitPane from './components/rspane/ResizeSplitPane'

let game = null

export default {
  components: {
    World,
    Editor,
    ResizeSplitPane
  },
  data: function() {
    return {
      code: 'b:\nstep(n)\na = 1\n\nif b == 3 &&\n dir(s) > 3 ||\n dir(n) == wall:\n\tstep(e,w)\nelse\n\ta = 9\n\tstep(n, s)\nendif\n\njump b',
      worldState: {},
      worldReady: false,
      compilerException: null,
      editorWidth: 400
    }
  },
  beforeCreate: function() {
    this.compilerTimeoutID = -1
  },
  methods: {
    handleWorldReady(worldState, gameScene) {
      game = gameScene
      this.worldState = worldState
      this.worldReady = true
      this.handleEditorResize(this.editorWidth)
      this.tryCompiling()
    },
    handleCodeChange() {
      if (!this.worldState.aiReady) {
        if (this.compilerTimeoutID >= 0) {
          clearTimeout(this.compilerTimeoutID)
        }
        this.compilerTimeoutID = setTimeout(this.tryCompilingAsync, 150)
      }
      else {
        this.tryCompiling()
      }
    },
    handleEditorResize(editorWidth) {
      if (game) {
        game.handleEditorResize(editorWidth)
      }
    },
    handlePlayPause(play) {
      if (game) {
        game.handlePlayPause(play)
      }
    },
    handleSpeedChange(speed) {
      if (game) {
        game.handleSpeedChange(speed)
      }
    },
    handleStep() {
      if (game) {
        game.step()
      }
    },
    handleStop() {
      if (game) {
        game.stop()
      }
    },
    tryCompilingAsync() {
      this.compilerTimeoutID = -1
      this.tryCompiling()
    },
    tryCompiling() {
      if (game) {
        this.compilerException = game.compileAI(this.code)
      }
    }
  }
}
</script>

<style lang="scss">
body,
html {
    height: 100vh;
    margin: 0;
    padding: 0;
    background-color: black;
    font-family: Consolas, Arial, sans-serif;
}

#app {
    margin: 0 auto;
    height: 100vh;
}

.pane-rs .Pane:last-child {
    z-index: 20;
}
</style>
