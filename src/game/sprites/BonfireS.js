import Phaser from 'phaser'

export default class BonfireS extends Phaser.GameObjects.Sprite {
  constructor(scene, bonfire, tileWidth, tileHeight) {
    super(scene, (bonfire.x + 0.5) * tileWidth, (bonfire.y + 0.5) * tileHeight - 22, 'bonfire')

    this.tileWidth = tileWidth
    this.tileHeight = tileHeight
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

  update() {

  }

  playAnimation() {
    let animation = this.bonfire.isEnabled() ? 'bonfire_on' : 'bonfire_off'
    this.play(animation)
  }
}