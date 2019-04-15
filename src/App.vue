<template>
<div id="app">

  <world @world-state-change="worldState = $event"
    @ai-state-change="aiReady = $event"
    @ready="handleWorldReady" />


  <resize-split-pane id="rs-pane"
    split-to="columns"
    @resize="handleEditorResize"
    :allow-resize="true"
    :size="editorWidth"
    :min-size="320"
    :resizerThickness="2"
    units="pixels"
    resizerColor="#4b5261"
    primary="second">

    <div slot="firstPane" />

    <editor slot="secondPane"
      v-model="code"
      :compilerConfig="compilerConfig"
      :worldState="worldState"
      :worldReady="worldReady"
      :aiReady="aiReady"
      :compilerException="compilerException"
      @change="handleCodeChange"
      @play-pause="handlePlayPause"
      @speed-change="handleSpeedChange"
      @step="handleStep"
      @stop="handleStop" />

  </resize-split-pane>
</div>
</template>

<script>
import World from './components/World'
import Editor from './components/Editor'
import ResizeSplitPane from './components/rspane/ResizeSplitPane'

export default {
  components: {
    World,
    Editor,
    ResizeSplitPane
  },
  data: function() {
    return {
      // code: 'b:\nstep(e)\na = dir(n)\n\nif b == 3 &&\n s > 3 ||\n n == wall:\n\tstep(e,w)\n\tstep(s)\n\tif n == wall:\n\t\tc:\n\t\tstep(sw)\n\tendif\nelse\n\ta = dir(sw)\n\tstep(n, s)\nendif\n\njump b\nstep(n)\nif n == wall:\n\t\tstep(nw)\n\tjump c\n\tendif\nstep(n)\nif n == s:\nendif\nstep(n)\nstep(n)\nstep(n)',
      // code: 'if s == s:\nelse\nif s == s:\nendif\nendif',
      code: 'if s == s:\nelse\nstep(n,s)\nendif\n',
      // code: '',
      compilerConfig: null,
      worldState: {},
      worldReady: false,
      aiReady: false,
      compilerException: null,
      editorWidth: 360
    }
  },
  beforeCreate: function() {
    this.compilerTimeoutID = -1
  },
  methods: {
    handleWorldReady(gameScene, worldState, compilerConfig) {
      this.gameScene = gameScene
      this.worldState = worldState
      this.compilerConfig = compilerConfig
      this.worldReady = true
      this.handleEditorResize(this.editorWidth)
      this.tryCompiling()
    },
    handleCodeChange() {
      if (!this.aiReady) {
        if (this.compilerTimeoutID >= 0) {
          clearTimeout(this.compilerTimeoutID)
        }
        this.compilerTimeoutID = setTimeout(this.tryCompilingAsync, 250)
      }
      else {
        this.tryCompiling()
      }
    },
    handleEditorResize(editorWidth) {
      if (this.gameScene) {
        this.gameScene.handleEditorResize(editorWidth)
      }
    },
    handlePlayPause(play) {
      if (this.gameScene) {
        this.gameScene.handlePlayPause(play)
      }
    },
    handleSpeedChange(speed) {
      if (this.gameScene) {
        this.gameScene.handleSpeedChange(speed)
      }
    },
    handleStep() {
      if (this.gameScene) {
        this.gameScene.step()
      }
    },
    handleStop() {
      if (this.gameScene) {
        this.gameScene.stop()
      }
    },
    tryCompilingAsync() {
      this.compilerTimeoutID = -1
      this.tryCompiling()
    },
    tryCompiling() {
      if (this.gameScene) {
        this.compilerException = this.gameScene.compileAI(this.code)
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
    font-family: Roboto, Arial, sans-serif;
}

:focus {
    outline: none;
}

#app {
    margin: 0 auto;
    height: 100vh;
}
</style>
