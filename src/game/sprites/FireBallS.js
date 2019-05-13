import Phaser from 'phaser'

export default class FireBallS extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, tileWidth, tileHeight) {
    super(scene, (x + 0.5) * tileWidth, (y + 0.5) * tileHeight - 6)
    this.depth = this.y
    this.on('animationcomplete', () => {
      this.destroy()
    })
    this.setFlip(Math.random() < 0.5, Math.random() < 0.5)
    this.play('explosion')
  }
}