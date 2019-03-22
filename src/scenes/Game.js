/* globals __DEV__ */
import Phaser from 'phaser'

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
    var text = this.add.text(100, 100, 'AI World', {
      font: '64px Bangers',
      fill: '#7744ff'
    })
  }
}