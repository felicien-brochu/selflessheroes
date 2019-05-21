import Phaser from 'phaser'

export default class BonfireS extends Phaser.GameObjects.Sprite {
  constructor(scene, bonfire, tileWidth, tileHeight, offsetX = 0, offsetY = -23) {
    super(scene, (bonfire.x + 0.5) * tileWidth + offsetX, (bonfire.y + 0.5) * tileHeight + offsetY, 'bonfire')

    this.offsetX = offsetX
    this.offsetY = offsetY
    this.depthOffset = -15
    this.updateDepth()
    this.bonfire = bonfire
    this.enabled = this.bonfire.isEnabled()
    this.playAnimation()
  }

  beforeStep(world) {
    if (this.bonfire.isEnabled() !== this.enabled) {
      this.enabled = this.bonfire.isEnabled()

      if (this.enabled) {
        let delay = Math.min(150, this.scene.runner.stepInterval / 2)
        setTimeout(() => this.playAnimation(), delay)
        this.scene.soundManager.play('bonfire_sfx')
      } else {
        this.playAnimation()
      }
    }
  }

  afterStep(world) {}

  updateDepth() {
    this.depth = (this.y - this.offsetY) + this.depthOffset
  }

  update() {

  }

  playAnimation() {
    let animation = this.bonfire.isEnabled() ? 'bonfire_on' : 'bonfire_off'
    this.play(animation)
  }
}