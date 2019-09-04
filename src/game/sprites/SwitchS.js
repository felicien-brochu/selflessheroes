import Phaser from 'phaser'

const assets = ['switch_blue', 'switch_red']

export default class SwitchS extends Phaser.GameObjects.Sprite {
  constructor(scene, mySwitch, tileWidth, tileHeight, offsetX = 0, offsetY = 0) {
    super(scene, (mySwitch.x + 0.5) * tileWidth + offsetX, (mySwitch.y + 0.5) * tileHeight + offsetY, assets[mySwitch.autoDisable ? 0 : 1])

    this.offsetX = offsetX
    this.offsetY = offsetY
    this.depthOffset = -15
    this.updateDepth()
    this.switch = mySwitch
    this.enabled = this.switch.isEnabled()
  }

  beforeStep(world) {
    if (this.enabled !== this.switch.isEnabled()) {
      setTimeout(() => {
          this.setFrame(this.enabled ? 1 : 0)
        },
        this.scene.runner.stepInterval / 2)
      this.enabled = this.switch.isEnabled()
    }
  }

  afterStep(world) {}

  updateDepth() {
    this.depth = (this.y - this.offsetY) + this.depthOffset
  }

  update() {}
}