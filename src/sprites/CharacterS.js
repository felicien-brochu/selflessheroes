import Phaser from 'phaser'

const stateIdle = 'idle'
const stateRun = 'run'

export default class CharacterS extends Phaser.GameObjects.Sprite {

  constructor(scene, character, asset, tileWidth, tileHeight, offsetX = 0, offsetY = 0) {
    let x = (character.x + 0.5) * tileWidth + offsetX,
      y = (character.y + 0.5) * tileHeight + offsetY
    super(scene, x, y, asset)

    this.tileWidth = tileWidth
    this.tileHeight = tileHeight
    this.character = character
    this.asset = asset
    this.offsetX = offsetX
    this.offsetY = offsetY

    this.lastTileX = character.x
    this.lastTileY = character.y

    this.actionState = stateIdle
    this.playAnimation()
  }

  playAnimation() {
    this.play(this.asset + '_' + this.actionState)
  }

  updateState() {
    let newState = stateIdle
    if (this.character.lastAction) {
      if (this.character.lastAction.type === 'move') {
        newState = stateRun
      }
    }
    if (this.actionState !== newState) {
      this.actionState = newState
      this.playAnimation()
    }
  }

  update() {
    this.updateState()
    if (this.lastTileX !== this.character.x || this.lastTileY !== this.character.y) {
      if (this.lastTileX < this.character.x) {
        this.setFlipX(false)
      } else if (this.lastTileX > this.character.x) {
        this.setFlipX(true)
      }
      this.scene.tweens.add({
        targets: this,
        x: (this.character.x + 0.5) * this.tileWidth + this.offsetX,
        y: (this.character.y + 0.5) * this.tileHeight + this.offsetY,
        duration: this.scene.runner.stepInterval,
        ease: 'Power2',
      })
      this.lastTileX = this.character.x
      this.lastTileY = this.character.y
    }
    this.depth = this.y
  }
}