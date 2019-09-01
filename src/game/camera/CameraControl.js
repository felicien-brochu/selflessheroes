import Phaser from 'phaser'

export default class CameraControl extends Phaser.Cameras.Controls.FixedKeyControl {
  constructor(config, scene, camera, controlConfig, visibleWidth, visibleHeight, mapWidth, mapHeight, margin) {
    super(controlConfig)

    this.config = config
    this.scene = scene
    this.visibleWidth = visibleWidth
    this.visibleHeight = visibleHeight
    this.mapWidth = mapWidth
    this.mapHeight = mapHeight
    this.margin = margin
  }

  init() {
    throw new Error('Needs subclass implementation')
  }

  onResize(visibleWidth, visibleHeight) {
    throw new Error('Needs subclass implementation')
  }

  update(delta) {
    throw new Error('Needs subclass implementation')
  }
}