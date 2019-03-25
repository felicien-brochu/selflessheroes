import Phaser from 'phaser'
import WebFont from 'webfontloader'

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

    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')

    WebFont.load({
      google: {
        families: ['Bangers']
      },
      custom: {
        families: [
          'Menlo',
          'Consolas'
        ],
        urls: [
          '//db.onlinewebfonts.com/c/9f94dc20bb2a09c15241d3a880b7ad01?family=Menlo',
          '//db.onlinewebfonts.com/c/1db29588408eadbd4406aae9238555eb?family=Consolas'
        ]
      },
      active: this.fontsLoaded
    })
  }

  update() {
    if (this.fontsReady) {
      this.scene.start('SplashScene')
    }
  }

  fontsLoaded() {
    this.fontsReady = true
  }
}