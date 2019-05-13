import Phaser from 'phaser'

const assets = ['button_blue', 'button_red']

export default class SwitchS extends Phaser.GameObjects.Sprite {
  constructor(scene, mySwitch, tileWidth, tileHeight) {
    super(scene, (mySwitch.x + 0.5) * tileWidth, (mySwitch.y + 0.5) * tileHeight, assets[mySwitch.color])

    this.tileWidth = tileWidth
    this.tileHeight = tileHeight
    this.switch = mySwitch
    this.enabled = this.switch.isEnabled()
  }

  beforeStep(world) {
    if (this.enabled !== this.switch.isEnabled()) {
      setTimeout(() =>
        this.setFrame(this.switch.isEnabled() ? 1 : 0),
        this.scene.runner.stepInterval / 2)
      this.enabled = this.switch.isEnabled()
    }
  }

  afterStep(world) {}

  update() {}
}