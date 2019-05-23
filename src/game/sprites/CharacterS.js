import Phaser from 'phaser'
import CharacterDeathReason from '../../world/CharacterDeathReason'
import Direction from '../../world/Direction'

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
    this.updateDepth()

    this.depthOffset = 0
    this._moving = false
    this.moveTimeline = null

    this.actionState = stateIdle
    this.newActionState = stateIdle
    this.dead = this.character.dead
    this.sleep = false

    this.sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, this.asset)
    this.sprite.setFlipX(Direction[this.character.initialDirection].dx < 0)
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

  updateState() {
    if (this.actionState !== this.newActionState && !this.dead) {
      this.actionState = this.newActionState
      if (this.newActionState === stateSleep) {
        this.sleepSprite.setVisible(true)
        this.sleepSprite.play('sleep_zzz')
      }
      this.playAnimation()
    }
  }

  beforeStep(world) {
    this.newActionState = this.sleep ? stateSleep : stateIdle

    if (!this.dead) {
      this.stopMoving()
    }

    if (this.character.lastAction) {
      if (this.character.lastAction.type === 'StepAction') {
        this.newActionState = stateRun
      } else if (this.character.lastAction.type === 'FireBallAction') {
        this.scene.throwFireBall(this.character, this.character.lastAction.direction)
        this.scene.soundManager.play('fireball_sfx')
        this.stateUpdateDelay += this.scene.runner.stepInterval / 2
      }

      if (this.lastTileX !== this.character.x || this.lastTileY !== this.character.y) {
        this.moveToNewLocation()

        this.lastTileX = this.character.x
        this.lastTileY = this.character.y
      }
    }

    if (!this.character.ai.hasStepAvailable() && !this.scene.runner.world.hasWon) {
      this.sleep = true
    }

    if (!this.dead && this.character.dead) {
      if (this.character.deathReason === CharacterDeathReason.burnt) {
        setTimeout(() => {
          // Check if destroyed
          if (this.scene) {
            this.sprite.play('ashes', true)
          }
        }, 200)
        this.scene.soundManager.play('scream_sfx')
      }
      this.depthOffset = -14
    }

    this.updateState()
    this.dead = this.character.dead
  }

  afterStep(world) {
    if (this.character.lastAction) {
      let action = this.character.lastAction
      if (action.type === 'StepAction') {
        this.emit('step-to', this, action.direction)
      }
    }

    if (this.character.ai &&
      this.character.ai.context &&
      this.character.ai.context.observations &&
      this.character.ai.context.observations.length > 0) {
      this.emit('observe', this, this.character.ai.context.observations)
      this.scene.updateCharacterObservations(this, this.character.ai.context.observations)
    }
    if (!this.moving) {
      this.afterStepAnimation()
    }
  }

  afterStepAnimation() {
    // If destroyed return
    if (!this.scene) {
      return
    }
    this.newActionState = stateIdle

    if (this.character.lastAction) {
      let action = this.character.lastAction
      if (action.type === 'StepAction') {
        this.newActionState = stateRun
      }

      if (action.type === 'FireBallAction' || action.type === 'StepAction') {
        let dir = action.direction
        if (dir.dx !== 0) {
          this.sprite.setFlipX(dir.dx < 0)
        }
      }
    }

    if (this.sleep) {
      this.newActionState = stateSleep
    }

    this.updateState()
  }

  updateDepth() {
    this.depth = (this.y - this.offsetY) + this.depthOffset
  }

  update() {
    this.updateDepth()
  }

  moveToNewLocation() {
    this.moveTimeline = this.scene.tweens.createTimeline()
    this.moveTimeline.on('complete', () => this.onMoveTimelineComplete())

    const maxDuration = 400
    let duration = Math.min(this.scene.runner.stepInterval, maxDuration)
    let ease = 'Quad.easeOut'
    if (duration <= 200) {
      ease = 'Quad.easeInOut'
    }

    this.moveTimeline.add({
      targets: this,
      x: (this.character.x + 0.5) * this.tileWidth + this.offsetX,
      y: (this.character.y + 0.5) * this.tileHeight + this.offsetY,
      duration: duration,
      ease: ease
    })
    this.scene.soundManager.play('step_sfx')

    if (this.character.dead && this.character.deathReason === CharacterDeathReason.fall) {
      this.moveTimeline.add({
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
    this.moveTimeline.play()
    this.moving = true
  }

  onMoveTimelineComplete() {
    this.moving = false
  }

  stopMoving() {
    if (this.moveTimeline) {
      this.moveTimeline.stop()
      this.moveTimeline = null
      this.x = (this.lastTileX + 0.5) * this.tileWidth + this.offsetX
      this.y = (this.lastTileY + 0.5) * this.tileHeight + this.offsetY
    }
    this.moving = false
  }

  onStartMoving() {}

  onStopMoving() {
    this.afterStepAnimation()
  }

  get moving() {
    return this._moving
  }

  set moving(moving) {
    let changed = moving !== this._moving
    this._moving = moving

    if (changed) {
      if (!this._moving) {
        this.onStopMoving()
      } else {
        this.onStartMoving()
      }
    }
  }
}