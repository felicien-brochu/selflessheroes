import Phaser from 'phaser'

import CameraControl from './CameraControl'

const zoomSpeed = 0.03
const translationSpeed = 0.05

export default class FollowCharactersCameraControl extends CameraControl {
  constructor(config, scene, camera, visibleWidth, visibleHeight, mapWidth, mapHeight, margin) {
    var controlConfig = {
      camera: camera,
    }

    super(config, scene, camera, controlConfig, visibleWidth, visibleHeight, mapWidth, mapHeight, margin)

    this.frame = this.config.frame
  }

  init() {
    let characterFrame = this.getCharacterFrame()
    this.frameMargin = {
      top: characterFrame.y - this.frame.y,
      bottom: (this.frame.y + this.frame.height) - (characterFrame.y + characterFrame.height),
      left: characterFrame.x - this.frame.x,
      right: (this.frame.x + this.frame.width) - (characterFrame.x + characterFrame.width),
    }

    this.camera.setZoom(this.getTargetZoom())
    this.resizeCameraViewport()
    this.resizeBounds()
    this.centerFrame()
  }

  getFrameCenter() {
    let target = this.getTargetFrame()
    let marginLeft = this.margin.left / this.camera.zoom
    let marginRight = this.margin.right / this.camera.zoom
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
    let target = this.getTargetFrame()
    let hZoom = (this.visibleWidth - (this.margin.left + this.margin.right)) / target.width
    let vZoom = (this.visibleHeight - (this.margin.top + this.margin.bottom)) / target.height
    let zoom = Math.min(hZoom, vZoom)
    return zoom
  }

  onResize(visibleWidth, visibleHeight) {
    this.setVisibleSize(visibleWidth, visibleHeight)
    this.camera.setZoom(this.getTargetZoom())
    this.resizeCameraViewport()
    this.centerFrame()
  }

  setVisibleSize(visibleWidth, visibleHeight) {
    if (visibleWidth !== this.visibleWidth || visibleHeight !== this.visibleHeight) {
      this.visibleWidth = visibleWidth
      this.visibleHeight = visibleHeight
      this.resizeCameraViewport()
      this.resizeBounds()
    }
  }

  resizeCameraViewport() {
    this.camera.setViewport(0, 0, this.visibleWidth, this.visibleHeight)
  }

  resizeBounds() {
    let maxDimension = Math.max(this.mapWidth, this.mapHeight)
    this.camera.setBounds(-(maxDimension / 2), -(maxDimension / 2), maxDimension * 2, maxDimension * 2)
  }

  getTargetFrame() {
    let characterFrame = this.getCharacterFrame()

    return {
      x: characterFrame.x - this.frameMargin.left,
      y: characterFrame.y - this.frameMargin.top,
      width: this.frameMargin.left + characterFrame.width + this.frameMargin.right,
      height: this.frameMargin.top + characterFrame.height + this.frameMargin.bottom,
    }
  }

  getCharacterFrame() {
    let characters = [
      ...this.scene.heroes,
      ...this.scene.npcs
    ]
    let x = Infinity
    let y = Infinity
    let maxX = 0
    let maxY = 0

    for (let character of characters) {
      x = Math.min(x, character.x - (character.displayWidth / 2))
      y = Math.min(y, character.y - (character.displayHeight / 2))
      maxX = Math.max(maxX, character.x + (character.displayWidth / 2))
      maxY = Math.max(maxY, character.y + (character.displayHeight / 2))
    }

    return {
      x: x,
      y: y,
      width: maxX - x,
      height: maxY - y
    }
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