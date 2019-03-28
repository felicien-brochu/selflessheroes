import Phaser from 'phaser'

const stateIdle = 'idle'
const stateRun = 'run'

export default class CharacterS extends Phaser.GameObjects.Sprite {

  constructor(scene, character, asset, tileWidth, tileHeight, offsetX = 0, offsetY = 0) {
    let x = (character.x + 0.5) * tileWidth + offsetX,
      y = (character.y + 0.5) * tileHeight + offsetY
    super(scene, x, y, asset)

    this._tileWidth = tileWidth
    this._tileHeight = tileHeight
    this._character = character
    this._asset = asset
    this._offsetX = offsetX
    this._offsetY = offsetY

    this._lastTileX = character.x
    this._lastTileY = character.y

    this._actionState = stateIdle
    this.playAnimation()
  }

  playAnimation() {
    this.play(this._asset + '_' + this._actionState)
  }

  updateState() {
    let newState = stateIdle
    if (this._character.lastAction) {
      if (this._character.lastAction.type === 'move') {
        newState = stateRun
      }
    }
    if (this._actionState !== newState) {
      this._actionState = newState
      this.playAnimation()
    }
  }

  update() {
    this.updateState()
    if (this._lastTileX !== this._character.x || this._lastTileY !== this._character.y) {
      if (this._lastTileX < this._character.x) {
        this.setFlipX(false)
      } else if (this._lastTileX > this._character.x) {
        this.setFlipX(true)
      }
      this.scene.tweens.add({
        targets: this,
        x: (this._character.x + 0.5) * this._tileWidth + this._offsetX,
        y: (this._character.y + 0.5) * this._tileHeight + this._offsetY,
        duration: this.scene.runner.stepInterval,
        ease: 'Power2',
      })
      this._lastTileX = this._character.x
      this._lastTileY = this._character.y
    }
    this.depth = this.y
  }
}