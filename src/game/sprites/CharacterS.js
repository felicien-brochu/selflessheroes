import Phaser from 'phaser'
import CharacterDeathReason from '../../world/CharacterDeathReason'

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
    this.depthLocked = false

    this.actionState = stateIdle
    this.dead = this.character.dead
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
      } else if (this.character.lastAction.type === 'FireBallAction') {
        newState = stateHit
        this.scene.throwFireBall(this.character, this.character.lastAction.direction)
      }
      if (this.lastTileX !== this.character.x || this.lastTileY !== this.character.y) {
        let timeline = this.scene.tweens.createTimeline()
        const maxDuration = 500
        let duration = Math.min(this.scene.runner.stepInterval, maxDuration)
        let ease = 'Quad.easeOut'
        if (duration <= 200) {
          ease = 'Quad.easeInOut'
        }

        timeline.add({
          targets: this,
          x: (this.character.x + 0.5) * this.tileWidth + this.offsetX,
          y: (this.character.y + 0.5) * this.tileHeight + this.offsetY,
          duration: duration,
          ease: ease
        })

        if (this.character.dead && this.character.deathReason === CharacterDeathReason.fall) {
          timeline.add({
            targets: this,
            y: (this.character.y + 0.5) * this.tileHeight + this.offsetY + 60,
            alphaTopLeft: -1,
            alphaTopRight: -1,
            alphaBottomLeft: -3,
            alphaBottomRight: -3,
            duration: duration,
            ease: ease
          })
        }
        timeline.play()

        this.lastTileX = this.character.x
        this.lastTileY = this.character.y
      }
    }
    if (!this.dead && this.character.dead) {
      if (this.character.deathReason === CharacterDeathReason.burnt) {
        setTimeout(() => this.play('ashes', true), 200)
      }
      this.depth = 0
      this.depthLocked = true
    } else {
      this.updateState(newState)
    }

    this.dead = this.character.dead
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
    if (!this.depthLocked) {
      this.depth = this.y
    }
  }
}