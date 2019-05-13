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

  update() {
    if (this.bonfire.isEnabled() !== this.enabled) {
      this.enabled = this.bonfire.isEnabled()

      this.playAnimation()
    }
  }

  playAnimation() {
    let animation = this.bonfire.isEnabled() ? 'bonfire_on' : 'bonfire_off'
    this.play(animation)
  }
}