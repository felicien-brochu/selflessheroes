<template>
<div id="world-content"></div>
</template>

<script>
import Phaser from 'phaser'

import gameConfig from '../game/config'

class Game extends Phaser.Game {
  constructor(gameSceneConfig) {
    super(gameConfig)
    this.gameSceneConfig = gameSceneConfig
  }
}

function resize() {
  // var canvas = document.querySelector("#world-content canvas");
  var windowWidth = window.innerWidth
  var windowHeight = window.innerHeight
  if (window.game) {
    window.game.scale.resize(windowWidth, windowHeight)
  }
}

window.onload = function() {
  resize()
  window.addEventListener("resize", resize, false)
}

export default {
  mounted: function() {
    window.game = new Game({
      onGameSceneReady: this.handleGameReady
    })
  },
  methods: {
    handleGameReady(gameScene) {
      gameScene.setWorldStateListener(this.handleWorldStateChange)
      gameScene.setAiStateListener(this.handleAiStateChange)
      this.$emit('ready', gameScene, gameScene.getWorldState(), gameScene.getCompilerConfig())
    },
    handleWorldStateChange(worldState) {
      this.$emit('world-state-change', worldState)
    },
    handleAiStateChange(aiReady) {
      this.$emit('ai-state-change', aiReady)
    }
  }
}
</script>

<style lang="scss">
#world-content {
    // z-index: 10;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
}
</style>
