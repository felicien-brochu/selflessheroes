import Phaser from 'phaser'

import CameraControl from './CameraControl'

const zoomSpeed = 0.2
const translationSpeed = 0.1
const maxZoom = 2

export default class FollowCharactersCameraControl extends CameraControl {
  constructor(config, scene, camera, visibleWidth, visibleHeight, floatingPanelWidth, mapWidth, mapHeight, margin) {
    var controlConfig = {
      camera: camera,
    }

    super(config, scene, camera, controlConfig, visibleWidth, visibleHeight, floatingPanelWidth, mapWidth, mapHeight, margin)

    this.frame = this.config.frame
  }

  init() {
    this.camera.setZoom(this.getTargetZoom())
    this.resizeCameraViewport()
    this.resizeBounds()
    this.centerFrame()
  }

  getFrameCenter() {
    let target = this.frame
    let marginLeft = this.margin.left / this.camera.zoom
    let marginRight = (this.margin.right + this.floatingPanelWidth) / this.camera.zoom
    let marginTop = this.margin.top / this.camera.zoom
    let marginBottom = this.margin.bottom / this.camera.zoom
    let centerX = target.x - marginLeft + ((target.width + marginLeft + marginRight) / 2)
    let centerY = target.y - marginTop + ((target.height + marginTop + marginBottom) / 2)

    return {
      x: centerX,
      y: centerY
    }
  }

  centerFrame() {
    let center = this.getFrameCenter()
    this.camera.centerOn(center.x, center.y)
  }

  getTargetZoom() {
    let target = this.frame
    let hZoom = (this.availableWidth - (this.margin.left + this.margin.right)) / target.width
    let vZoom = (this.visibleHeight - (this.margin.top + this.margin.bottom)) / target.height
    let zoom = Math.min(hZoom, vZoom)
    zoom = Math.min(zoom, maxZoom)
    return zoom
  }

  onResize(visibleWidth, visibleHeight, floatingPanelWidth) {
    this.setVisibleSize(visibleWidth, visibleHeight, floatingPanelWidth)
  }

  setVisibleSize(visibleWidth, visibleHeight, floatingPanelWidth) {
    if (visibleWidth !== this.visibleWidth || visibleHeight !== this.visibleHeight || this.floatingPanelWidth !== floatingPanelWidth) {
      this.visibleWidth = visibleWidth
      this.visibleHeight = visibleHeight
      this.floatingPanelWidth = floatingPanelWidth
      this.resizeCameraViewport()
      this.resizeBounds()
    }
  }

  resizeCameraViewport() {
    this.camera.setViewport(0, 0, this.visibleWidth, this.visibleHeight)
  }

  resizeBounds() {
    let targetZoom = Math.max(0.1, this.getTargetZoom() - 0.5)
    let width = this.visibleWidth / targetZoom
    let height = this.visibleHeight / targetZoom
    let xOrigin = -(width - (this.mapWidth)) / 2
    let yOrigin = -(height - (this.mapHeight)) / 2
    this.camera.setBounds(xOrigin, yOrigin, width, height)
  }

  update(delta) {
    if (!this.active) {
      return
    }

    if (delta === undefined) {
      delta = 1
    }

    let cam = this.camera

    let newZoom = Phaser.Math.Linear(cam.zoom, this.getTargetZoom(), zoomSpeed)
    cam.setZoom(newZoom)

    let center = this.getFrameCenter()
    center.x = Phaser.Math.Linear(cam.centerX + cam.scrollX, center.x, translationSpeed)
    center.y = Phaser.Math.Linear(cam.centerY + cam.scrollY, center.y, translationSpeed)
    cam.centerOn(center.x, center.y)
  }
}