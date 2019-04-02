<template>
<div id="world-content"></div>
</template>

<script>
import Phaser from 'phaser'

import gameConfig from '../config'

class Game extends Phaser.Game {
  constructor(gameSceneConfig) {
    super(gameConfig)
    this.gameSceneConfig = gameSceneConfig
  }
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
      this.$emit('ready', gameScene.getWorldState(), gameScene)
    },
    handleWorldStateChange(worldState) {
      this.$emit('world-state-change', worldState)
    }
  }
}
</script>

<style lang="scss">
#world-content {
    z-index: 10;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;

    canvas {
        width: 100%;
        height: 100%;
    }
}
</style>
