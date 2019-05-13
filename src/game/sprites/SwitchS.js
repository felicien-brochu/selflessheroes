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

  update() {
    if (this.switch.isEnabled() !== this.enabled) {
      this.enabled = this.switch.isEnabled()

      let duration = this.scene.runner.stepInterval
      setTimeout(() => {
        this.setFrame(this.enabled ? 1 : 0)
      }, duration)
    }
  }
}