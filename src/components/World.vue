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

export default {
  props: {
    "followHeroIndex": {
      type: Number
    }
  },

  mounted() {
    this.game = new Game({
      onGameSceneReady: this.handleGameReady
    })
    window.addEventListener("resize", this.resizeGame, false)
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.resizeGame)
  },

  watch: {
    followHeroIndex: function() {
      if (this.gameScene) {
        this.gameScene.setFollowHero(this.followHeroIndex)
      }
    }
  },

  methods: {
    handleGameReady(gameScene) {
      this.gameScene = gameScene

      this.gameScene.setWorldStateListener(this.handleWorldStateChange)
      this.gameScene.setAiStateListener(this.handleAiStateChange)
      this.gameScene.setFollowHeroListener(this.handleFollowHeroChange)
      this.gameScene.setFollowHero(this.followHeroIndex)

      this.$emit('ready', this.gameScene, this.gameScene.getWorldState(), this.gameScene.getCompilerConfig())
    },

    handleWorldStateChange(worldState) {
      this.$emit('world-state-change', worldState)
    },

    handleAiStateChange(aiReady) {
      this.$emit('ai-state-change', aiReady)
    },

    handleFollowHeroChange(heroIndex) {
      this.$emit('follow-hero-change', heroIndex)
    },


    resizeGame() {
      var windowWidth = window.innerWidth
      var windowHeight = window.innerHeight
      this.game.scale.resize(windowWidth, windowHeight)
    }
  }
}
</script>

<style lang="scss">
#world-content {
    z-index: 5;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
}
</style>
