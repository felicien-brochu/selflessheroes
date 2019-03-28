<template>
<div id="app">
  <world @world-state-change="worldState = $event" @ready="handleWorldReady" />
  <res-split-pane split-to="columns" @update:size="handleResize" :allow-resize="true" :size="400" :min-size="300" units="pixels" resizerColor="#4b5261" primary="second">
    <div slot="firstPane" />
    <editor slot="secondPane" :worldState="worldState" :worldReady="worldReady" @run-ai="handleRunAI" @play-pause="handlePlayPause" @speed-change="handleSpeedChange" @step="handleStep" @stop="handleStop" v-model="code" />
  </res-split-pane>
</div>
</template>

<script>
import World from './components/World'
import Editor from './components/Editor'
import ResSplitPane from 'vue-resize-split-pane'

let game = null

export default {
  components: {
    World,
    Editor,
    ResSplitPane
  },
  data: function() {
    return {
      code: 'return {\n\ttype: "move",\n\tx: 1,\n\ty: 1\n}',
      worldState: {},
      worldReady: false
    }
  },
  methods: {
    handleWorldReady(worldState, gameScene) {
      game = gameScene
      this.worldState = worldState
      this.worldReady = true
    },
    handleResize(e) {
      if (game) {
        game.handleResizeCamera(e)
      }
    },
    handleRunAI() {
      if (game) {
        game.runAI(this.$data.code)
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
