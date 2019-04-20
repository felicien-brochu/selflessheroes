import Phaser from 'phaser'
import WebFont from 'webfontloader'

import loader_bg from './images/loader-bg.png'
import loader_bar from './images/loader-bar.png'

export default class extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene'
    })
  }

  preload() {
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
    this.add.text(100, 100, 'loading fonts...')

    this.load.image('loaderBg', loader_bg)
    this.load.image('loaderBar', loader_bar)

    WebFont.load({
      custom: {
        families: ['Material Icons', 'Noto', 'Menlo', 'Consolas', 'Monaco', 'Roboto'],
        urls: ['./assets/fonts/fonts.css']
      },
      active: this.fontsLoaded
    })
  }

  fontsLoaded() {
    this.scene.start('SplashScene')
  }
}