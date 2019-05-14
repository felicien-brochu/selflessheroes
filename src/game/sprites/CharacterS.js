import Phaser from 'phaser'

const stateIdle = 'idle'
const stateRun = 'run'
const stateHit = 'hit'

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
    this.depth = this.y

    this.actionState = stateIdle
    this.playAnimation()
  }

  playAnimation() {
    this.play(`${this.asset}_${this.actionState}`)
  }

  updateState(newState) {
    if (this.actionState !== newState) {
      this.actionState = newState
      this.playAnimation()
    }
  }

  beforeStep(world) {
    let newState = stateIdle
    if (this.character.lastAction) {
      if (this.character.lastAction.type === 'StepAction') {
        newState = stateRun
        if (this.lastTileX !== this.character.x || this.lastTileY !== this.character.y) {
          const maxDuration = 500
          let duration = Math.min(this.scene.runner.stepInterval, maxDuration)
          let ease = 'Quad.easeOut'
          if (duration <= 200) {
            ease = 'Quad.easeInOut'
          }
          this.scene.tweens.add({
            targets: this,
            x: (this.character.x + 0.5) * this.tileWidth + this.offsetX,
            y: (this.character.y + 0.5) * this.tileHeight + this.offsetY,
            duration: duration,
            ease: ease
          })
          this.lastTileX = this.character.x
          this.lastTileY = this.character.y
        }
      } else if (this.character.lastAction.type === 'FireBallAction') {
        newState = stateHit
        this.scene.throwFireBall(this.character, this.character.lastAction.direction)
      }
      this.updateState(newState)
    }
  }

  afterStep(world) {
    let newState = stateIdle
    if (this.lastTileX !== this.character.x) {
      this.setFlipX(this.lastTileX > this.character.x)
    }
    if (this.character.lastAction) {
      if (this.character.lastAction.type === 'StepAction') {
        newState = stateRun
      } else if (this.character.lastAction.type === 'FireBallAction') {
        let dir = this.character.lastAction.direction
        if (dir.dx !== 0) {
          this.setFlipX(dir.dx < 0)
        }
      }
    }
    this.updateState(newState)
  }

  update() {
    this.depth = this.y
  }
}