import Phaser from 'phaser'

import CameraControl from './CameraControl'

const maxZoom = 2
const minZoom = 0.5
const xMargin = 64
const yMargin = 64

export default class SimpleCameraControl extends CameraControl {
  constructor(config, scene, camera, visibleWidth, visibleHeight, floatingPanelWidth, mapWidth, mapHeight, margin) {
    var controlConfig = {
      camera: camera,
    }

    super(config, scene, camera, controlConfig, visibleWidth, visibleHeight, floatingPanelWidth, mapWidth, mapHeight, margin)

    this.frame = this.config.frame
  }

  init() {
    this.setInitialZoom()
    this.resizeCameraViewport()
    this.resizeBounds()
    this.centerFrame()
  }

  centerFrame() {
    let marginLeft = this.margin.left / this.camera.zoom
    let marginRight = (this.margin.right + this.floatingPanelWidth) / this.camera.zoom
    let marginTop = this.margin.top / this.camera.zoom
    let marginBottom = this.margin.bottom / this.camera.zoom
    let centerX = this.frame.x - marginLeft + ((this.frame.width + marginLeft + marginRight) / 2)
    let centerY = this.frame.y - marginTop + ((this.frame.height + marginTop + marginBottom) / 2)
    this.camera.centerOn(centerX, centerY)
  }

  setInitialZoom() {
    let hZoom = (this.availableWidth - (this.margin.left + this.margin.right)) / this.frame.width
    let vZoom = (this.visibleHeight - (this.margin.top + this.margin.bottom)) / this.frame.height
    let zoom = Math.min(hZoom, vZoom)
    zoom = Math.max(zoom, minZoom)
    zoom = Math.min(zoom, maxZoom)
    this.camera.setZoom(zoom)
  }

  onResize(visibleWidth, visibleHeight, floatingPanelWidth) {
    this.setVisibleSize(visibleWidth, visibleHeight, floatingPanelWidth)
    this.init()
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
    let camera = this.camera

    let minWidth = this.mapWidth + 2 * xMargin
    let minHeight = this.mapHeight + 2 * yMargin
    let width
    let height
    let x
    let y

    if (camera.zoom * minWidth < this.visibleWidth) {
      x = -((this.visibleWidth / camera.zoom) - this.mapWidth) / 2
      width = this.visibleWidth / camera.zoom
    } else {
      x = -xMargin
      width = minWidth
    }

    if (camera.zoom * minHeight < this.visibleHeight) {
      y = -((this.visibleHeight / camera.zoom) - this.mapHeight) / 2
      height = this.visibleHeight / camera.zoom
    } else {
      y = -yMargin
      height = minHeight
    }
    camera.setBounds(x, y, width, height)
  }

  update(delta) {
    if (!this.active) {
      return
    }

    if (delta === undefined) {
      delta = 1
    }

    let cam = this.camera
  }
}