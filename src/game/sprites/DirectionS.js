import Phaser from 'phaser'

export default class ObservationS extends Phaser.GameObjects.Sprite {
  constructor(scene, direction, x, y, tileWidth, tileHeight, offsetX = 0, offsetY = 0) {
    super(scene, (x + 0.5) * tileWidth + offsetX, (y + 0.5) * tileHeight + offsetY, `direction_${direction.getName()}`)

    this.direction = direction
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