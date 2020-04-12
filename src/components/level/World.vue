<template>
<div id="world-content"></div>
</template>

<script>
import Vue from 'vue'
import Phaser from 'phaser'

import gameConfig from '../../game/config'

class Game extends Phaser.Game {
  constructor(gameSceneConfig) {
    super(gameConfig())
    this.gameSceneConfig = gameSceneConfig
  }
}

export default {
  props: {
    "level": {
      type: Object
    },
    "preferences": {
      type: Object
    },
    "followHeroIndex": {
      type: Number
    }
  },

  mounted() {
    this.game = new Game({
      onGameSceneReady: this.handleGameReady,
      level: this.level
    })
    window.addEventListener("resize", this.resizeGame, false)
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.resizeGame)
    if (this.gameScene) {
      this.gameScene.customEvents.removeListener('ai-state-change', this.handleAiStateChange)
      this.gameScene.customEvents.removeListener('follow-hero-change', this.handleFollowHeroChange)
      this.gameScene.runner.events.removeListener('world-state-change', this.handleWorldStateChange)
    }
    if (this.game) {
      this.game.destroy(true)
      // Call this to prevent memory leak
      this.game.scale.stopListeners()
    }
    Vue.prototype.$gameScene = undefined
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

      this.gameScene.soundManager.setVolumePreference(this.preferences.soundVolume)
      this.gameScene.customEvents.on('ai-state-change', this.handleAiStateChange)
      this.gameScene.customEvents.on('follow-hero-change', this.handleFollowHeroChange)
      this.gameScene.runner.events.on('world-state-change', this.handleWorldStateChange)
      this.gameScene.setFollowHero(this.followHeroIndex)
      Vue.prototype.$gameScene = this.gameScene

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

    onTransitionAfterEnter() {
      this.resizeGame()
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
