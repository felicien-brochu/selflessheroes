import Phaser from 'phaser'
import CharacterDeathReason from '../../world/CharacterDeathReason'

const stateIdle = 'idle'
const stateRun = 'run'
const stateHit = 'hit'
const stateSleep = 'sleep'

export default class CharacterS extends Phaser.GameObjects.Container {

  constructor(scene, character, asset, tileWidth, tileHeight, offsetX = 0, offsetY = 0) {
    let x = (character.x + 0.5) * tileWidth + offsetX,
      y = (character.y + 0.5) * tileHeight + offsetY
    super(scene, x, y)

    this.character = character
    this.asset = asset
    this.tileWidth = tileWidth
    this.tileHeight = tileHeight
    this.offsetX = offsetX
    this.offsetY = offsetY


    this.lastTileX = character.x
    this.lastTileY = character.y
    this.depth = this.y
    this.depthLocked = false
    this.stateUpdateDelay = 0

    this.actionState = stateIdle
    this.dead = this.character.dead
    this.sleep = false

    this.sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, this.asset)
    this.sleepSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'sleep_zzz')
    this.sleepSprite.depth = 1
    this.sleepSprite.setVisible(false)

    this.scene.add.existing(this.sprite)
    this.scene.add.existing(this.sleepSprite)
    this.add(this.sprite)
    this.add(this.sleepSprite)
    this.setSize(this.sprite.width, this.sprite.height)
    this.playAnimation()
  }

  playAnimation() {
    this.sprite.play(`${this.asset}_${this.actionState}`)
  }

  updateState(newState) {
    if (this.actionState !== newState) {
      this.actionState = newState
      if (newState === stateSleep) {
        this.sleepSprite.setVisible(true)
        this.sleepSprite.play('sleep_zzz')
      }
      this.playAnimation()
    }
  }

  beforeStep(world) {
    let newState = this.sleep ? stateSleep : stateIdle
    if (this.character.lastAction) {
      if (this.character.lastAction.type === 'StepAction') {
        newState = stateRun
      } else if (this.character.lastAction.type === 'FireBallAction') {
        this.scene.throwFireBall(this.character, this.character.lastAction.direction)
        this.scene.soundManager.play('fireball_sfx')
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
        this.stateUpdateDelay = duration * 0.2
        this.scene.soundManager.play('step_sfx')

        if (this.character.dead && this.character.deathReason === CharacterDeathReason.fall) {
          timeline.add({
            targets: this,
            y: (this.character.y + 0.5) * this.tileHeight + this.offsetY + 60,
            alpha: -1,
            duration: duration,
            ease: ease
          })
          this.scene.soundManager.play('scream_sfx', {
            delay: duration / 1000
          })
        }
        this.stateUpdateDelay += duration
        timeline.play()

        this.lastTileX = this.character.x
        this.lastTileY = this.character.y
      }
    }

    if (!this.character.ai.hasStepAvailable() && !this.scene.runner.world.hasWon) {
      this.sleep = true
    }

    if (!this.dead && this.character.dead) {
      if (this.character.deathReason === CharacterDeathReason.burnt) {
        setTimeout(() => this.sprite.play('ashes', true), 200)

        this.scene.soundManager.play('scream_sfx')
      }
      this.depth = 0
      this.depthLocked = true
    } else if (!this.dead) {
      this.updateState(newState)
    }

    this.dead = this.character.dead
  }

  afterStep(world) {
    let newState = stateIdle
    if (this.lastTileX !== this.character.x) {
      this.sprite.setFlipX(this.lastTileX > this.character.x)
    }
    if (this.character.lastAction) {
      if (this.character.lastAction.type === 'StepAction') {
        newState = stateRun
      } else if (this.character.lastAction.type === 'FireBallAction') {
        let dir = this.character.lastAction.direction
        if (dir.dx !== 0) {
          this.sprite.setFlipX(dir.dx < 0)
        }
      }
    }
    if (this.sleep) {
      newState = stateSleep
    }
    if (!this.dead) {
      setTimeout(() => {
        this.updateState(newState)
      }, this.stateUpdateDelay)
      this.stateUpdateDelay = 0
    }
  }

  update() {
    if (!this.depthLocked) {
      this.depth = this.y
    }
  }
}