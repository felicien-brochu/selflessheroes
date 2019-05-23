import Phaser from 'phaser'

export default class ObservationS extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, tileWidth, tileHeight, offsetX = 0, offsetY = -2) {
    super(scene, (x + 0.5) * tileWidth + offsetX, (y + 0.5) * tileHeight + offsetY, 'observation')

    this.offsetX = offsetX
    this.offsetY = offsetY
    this.depthOffset = 1
    this.setDisplaySize(tileWidth, tileHeight)
    this.updateDepth()
  }

  beforeStep(world) {}

  afterStep(world) {}

  updateDepth() {
    this.depth = (this.y - this.offsetY) + this.depthOffset
  }

  update() {}
}