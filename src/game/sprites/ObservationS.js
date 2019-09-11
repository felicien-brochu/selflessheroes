import Phaser from 'phaser'

export default class ObservationS extends Phaser.GameObjects.Sprite {
  constructor(scene, tileX, tileY, direction, tileWidth, tileHeight, offsetX = 0, offsetY = -2) {
    super(scene, (tileX + 0.5) * tileWidth + offsetX, (tileY + 0.5) * tileHeight + offsetY, 'observation')

    this.direction = direction
    this.tileX = tileX
    this.tileY = tileY
    this.offsetX = offsetX
    this.offsetY = offsetY
    this.tileWidth = tileWidth
    this.tileHeight = tileHeight
    this.depthOffset = 3
    this.setDisplaySize(tileWidth, tileHeight)
    this.updatePosition()
    this.updateDepth()
  }

  setTilePosition(tileX, tileY) {
    this.tileX = tileX
    this.tileY = tileY

    this.updatePosition()
  }

  updatePosition() {
    this.x = (this.tileX + this.direction.dx + 0.5) * this.tileWidth + this.offsetX
    this.y = (this.tileY + this.direction.dy + 0.5) * this.tileHeight + this.offsetY

    this.updateDepth()
  }

  updateDepth() {
    this.depth = (this.y - this.offsetY) + this.depthOffset
  }

  update() {}
}