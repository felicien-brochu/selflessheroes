<template>
<div id="world-content"></div>
</template>

<script>
import Phaser from 'phaser'

import BootScene from '../scenes/Boot'
import SplashScene from '../scenes/Splash'
import GameScene from '../scenes/Game'

import config from '../config'

const gameConfig = Object.assign(config, {
  scene: [BootScene, SplashScene, GameScene]
})

class Game extends Phaser.Game {
  constructor() {
    super(gameConfig)
  }
}


export default {
  components: {},
  mounted: () => {
    window.game = new Game()
  }
}
</script>

<style lang="scss">
#world-content {
    z-index: 10;
    right: 0;
    height: 100%;
    position: absolute;

    canvas {
        width: 100%;
        height: 100%;
    }
}
</style>
