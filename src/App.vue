<template>
<div id="app">
  <world @world-state-change="worldState = $event" @ready="handleWorldReady" />
  <resize-split-pane split-to="columns" @resize="handleResize" :allow-resize="true" :size="400" :min-size="352" units="pixels" resizerColor="#4b5261" primary="second">
    <div slot="firstPane" />
    <editor slot="secondPane" v-model="code" :worldState="worldState" :worldReady="worldReady" :compilerException="compilerException" @change="handleCodeChange" @run-ai="handleRunAI" @play-pause="handlePlayPause" @speed-change="handleSpeedChange"
      @step="handleStep" @stop="handleStop" />
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
      code: 'a:  \nb:\nstep(n)\na = dir(s)\n\t \n  if b == 3 &&\n\t 4 < \n\n3\n\t ||1>dir( n ):\nelse\n\na = 9\n\tstep(n, s)\n\njump b\n\nendif',
      worldState: {},
      worldReady: false,
      compilerException: null
    }
  },
  methods: {
    handleWorldReady(worldState, gameScene) {
      game = gameScene
      this.worldState = worldState
      this.worldReady = true
    },
    handleCodeChange() {
      if (game) {
        this.compilerException = game.compileAI(this.code)
      }
    },
    handleResize(e) {
      if (game) {
        game.handleResizeCamera(e)
      }
    },
    handleRunAI() {
      if (game) {
        game.runAI(this.code)
      }
    },
    handlePlayPause(play) {
      if (game) {
        if (play) {
          game.play()
        }
        else {
          game.pause()
        }
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
    background-color: #a99ea2;
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
