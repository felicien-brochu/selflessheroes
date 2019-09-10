import Phaser from 'phaser'

export default class LightableS extends Phaser.GameObjects.Sprite {
  constructor(scene, lightable, tileWidth, tileHeight, offsetX = 0, offsetY = 0, asset, animationOn, animationOff) {
    super(scene, (lightable.x + 0.5) * tileWidth + offsetX, (lightable.y + 0.5) * tileHeight + offsetY, asset)

    this.offsetX = offsetX
    this.offsetY = offsetY
    this.depthOffset = -15
    this.updateDepth()
    this.lightable = lightable
    this.animationOn = animationOn
    this.animationOff = animationOff
    this.enabled = this.lightable.isEnabled()
    this.playAnimation()
  }

  beforeStep(world) {
    if (this.lightable.isEnabled() !== this.enabled) {
      this.enabled = this.lightable.isEnabled()

      if (this.enabled) {
        let delay = Math.min(150, this.scene.runner.stepInterval / 2)
        setTimeout(() => this.playAnimation(), delay)
        this.scene.soundManager.play('light_sfx')
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
    let animation = this.lightable.isEnabled() ? this.animationOn : this.animationOff
    this.play(animation)
  }
}