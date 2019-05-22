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
      this.depthOffset = -14
    }

    this.updateState()
    this.dead = this.character.dead
  }

  afterStep(world) {
    this.newActionState = stateIdle
    if (this.lastTileX !== this.character.x) {
      this.sprite.setFlipX(this.lastTileX > this.character.x)
    }
    if (this.character.lastAction) {
      if (this.character.lastAction.type === 'StepAction') {
        this.newActionState = stateRun
      } else if (this.character.lastAction.type === 'FireBallAction') {
        let dir = this.character.lastAction.direction
        if (dir.dx !== 0) {
          this.sprite.setFlipX(dir.dx < 0)
        }
      }
    }
    if (this.sleep) {
      this.newActionState = stateSleep
    }

    if (!this.moving) {
      this.afterStepAnimation()
    }
  }

  afterStepAnimation() {
    this.updateState()
  }

  updateDepth() {
    this.depth = (this.y - this.offsetY) + this.depthOffset
  }

  update() {
    this.updateDepth()
  }

  moveToNewLocation() {
    this.moveTimeline = this.scene.tweens.timeline()

    const maxDuration = 500
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
    this.moveTimeline.on('complete', () => this.onMoveTimelineStop)
    this.moveTimeline.play()
    this.moving = true

    this.lastTileX = this.character.x
    this.lastTileY = this.character.y
  }

  onMoveTimelineStop() {
    this.moving = false
  }

  stopMoving() {
    if (this.moveTimeline) {
      this.moveTimeline.stop()
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