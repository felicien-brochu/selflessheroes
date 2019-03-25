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

window.game = new Game()

export default {
  components: {}
}
</script>

<style lang="scss">
#world-content {
    right: 0;
    height: 100%;
    position: absolute;

    canvas {
        width: 100%;
        height: 100%;
    }
}
</style>
