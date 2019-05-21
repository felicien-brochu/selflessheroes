import Phaser from 'phaser'

export default class FireBallS extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, tileWidth, tileHeight, offsetX = 0, offsetY = -16) {
    super(scene, (x + 0.5) * tileWidth + offsetX, (y + 0.5) * tileHeight + offsetY)

    this.offsetX = offsetX
    this.offsetY = offsetY
    this.depthOffset = 5
    this.updateDepth()
    this.on('animationcomplete', () => {
      this.destroy()
    })
    this.setFlip(Math.random() < 0.5, Math.random() < 0.5)
    this.play('explosion')
  }

  updateDepth() {
    this.depth = (this.y - this.offsetY) + this.depthOffset
  }
}