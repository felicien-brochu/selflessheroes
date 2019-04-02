import Phaser from 'phaser'

const assets = ['button_blue', 'button_red']

export default class ObjectiveS extends Phaser.GameObjects.Sprite {
  constructor(scene, objective, tileWidth, tileHeight) {
    super(scene, (objective.x + 0.5) * tileWidth, (objective.y + 0.5) * tileHeight, assets[objective.color])

    this.tileWidth = tileWidth
    this.tileHeight = tileHeight
    this.objective = objective
  }

  update() {
    this.setFrame(this.objective.isEnabled() ? 1 : 0)
  }
}