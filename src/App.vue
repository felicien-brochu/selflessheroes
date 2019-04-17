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

    <div slot="firstPane"
      class="left-panel">
      <run-bar :worldReady="worldReady"
        :aiReady="aiReady"
        :worldState="worldState"
        @play-pause="handlePlayPause"
        @speed-change="handleSpeedChange"
        @step="handleStep"
        @stop="handleStop" />
    </div>

    <editor slot="secondPane"
      :code="code"
      :compilerConfig="compilerConfig"
      :worldReady="worldReady"
      :playing="playing"
      :compilerExceptions="compilerExceptions"
      @code-change="handleCodeChange" />

  </resize-split-pane>
</div>
</template>

<script>
import World from './components/World'
import Editor from './components/Editor'
import RunBar from './components/runbar/RunBar'
import ResizeSplitPane from './components/rspane/ResizeSplitPane'

export default {
  components: {
    World,
    Editor,
    RunBar,
    ResizeSplitPane
  },
  data: function() {
    return {
      // code: 'b:\nstep(e)\na = dir(n)\n\nif b == 3 &&\n s > 3 ||\n n == wall:\n\tstep(e,w)\n\tstep(s)\n\tif n == wall:\n\t\tc:\n\t\tstep(sw)\n\tendif\nelse\n\ta = dir(sw)\n\tstep(n, s)\nendif\n\njump b\nstep(n)\nif n == wall:\n\t\tstep(nw)\n\tjump c\n\tendif\nstep(n)\nif n == s:\nendif\nstep(n)\nstep(n)\nstep(n)',
      // code: 'if s == s:\nelse\nif s == s:\nendif\nendif',
      code: '',
      compilerConfig: null,
      worldState: {},
      worldReady: false,
      aiReady: false,
      compilerExceptions: {
        fatal: [],
        undefinedLiterals: []
      },
      editorWidth: 360
    }
  },
  beforeCreate: function() {
    this.compilerTimeoutID = -1
  },
  computed: {
    playing: function() {
      return !this.worldReady || this.worldState.steps > 0
    }
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
    handleCodeChange(code) {
      this.code = code
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
        this.compilerExceptions = this.gameScene.compileAI(this.code)
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
    font-family: 'Roboto', Arial, sans-serif;
}

:focus {
    outline: none;
}

#app {
    margin: 0 auto;
    height: 100vh;

    #rs-pane {
        z-index: 5;
        pointer-events: none;

        & > * {
            pointer-events: all;
        }

        .Pane:first-child {
            pointer-events: none;
            .left-panel {
                position: relative;
                width: 100%;
                height: 100%;
                .run-bar {
                    z-index: 5;
                    position: absolute;
                    width: 308px;
                    bottom: 20px;
                    margin-left: auto;
                    margin-right: auto;
                    left: 0;
                    right: 0;
                    pointer-events: all;
                    box-shadow: 0 2px 8px 0 rgba(15, 17, 20, 0.7);
                }
            }
        }
    }
}
</style>
