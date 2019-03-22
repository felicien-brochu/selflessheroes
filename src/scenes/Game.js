/* globals __DEV__ */
import Phaser from 'phaser'

import lang from '../lang'
import Mushroom from '../sprites/Mushroom'

export default class extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene'
    })
  }
  init() {}
  preload() {}

  create() {
    this.mushroom = new Mushroom({
      scene: this,
      x: 400,
      y: 300,
      asset: 'mushroom'
    })

    this.add.existing(this.mushroom)
    const bannerText = lang.text('welcome')
    var text = this.add.text(100, 100, bannerText, {
      font: '64px Bangers',
      fill: '#7744ff'
    })
  }
}