import Phaser from 'phaser'

const assets = ['button_blue', 'button_red']

export default class ObjectiveS extends Phaser.GameObjects.Sprite {
  constructor(scene, objective, tileWidth, tileHeight) {
    super(scene, (objective.x + 0.5) * tileWidth, (objective.y + 0.5) * tileHeight, assets[objective.color])

    this.tileWidth = tileWidth
    this.tileHeight = tileHeight
    this.objective = objective
    this.enabled = this.objective.isEnabled()
  }

  update() {
    if (this.objective.isEnabled() !== this.enabled) {
      this.enabled = this.objective.isEnabled()

      let duration = this.scene.runner.stepInterval
      setTimeout(() => {
        this.setFrame(this.enabled ? 1 : 0)
      }, duration)
    }
  }
}