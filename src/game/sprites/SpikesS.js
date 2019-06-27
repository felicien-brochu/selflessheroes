import Phaser from 'phaser'

export default class SpikesS extends Phaser.GameObjects.Sprite {
  constructor(scene, spikes, tileWidth, tileHeight, offsetX = 0, offsetY = 0) {
    super(scene, (spikes.x + 0.5) * tileWidth + offsetX, (spikes.y + 0.5) * tileHeight + offsetY, 'spikes')

    this.offsetX = offsetX
    this.offsetY = offsetY
    this.spikes = spikes
    this.enabled = this.spikes.isEnabled()
    this.playAnimation()
  }

  beforeStep(world) {
    if (this.spikes.isEnabled() !== this.enabled) {
      this.enabled = this.spikes.isEnabled()

      if (this.enabled) {
        this.scene.soundManager.play('spikes_on_sfx')
      } else {
        this.scene.soundManager.play('spikes_off_sfx')
      }
      let delay = Math.min(150, this.scene.runner.stepInterval / 2)
      setTimeout(() => this.playAnimation(), delay)
    }
  }

  afterStep(world) {}

  update() {

  }

  playAnimation() {
    let animation = this.enabled ? 'spikes_on' : 'spikes_off'
    this.play(animation)
  }
}