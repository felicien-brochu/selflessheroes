import Phaser from 'phaser'
import CalculationS from './CalculationS'
import CharacterDeathReason from '../../world/objects/CharacterDeathReason'
import Direction from '../../world/Direction'

const stateIdle = 'idle'
const stateRun = 'run'
const stateHit = 'hit'
const stateSleep = 'sleep'

const itemContainerInitialY = -14.4

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
    this.brightness = 0xff
    this.updateDepth()

    this.depthOffset = 0
    this._moving = false
    this.moveTimeline = null
    this.itemContainerTween = null

    this.actionState = stateIdle
    this.newActionState = stateIdle
    this.dead = this.character.dead
    this.lastCharacter = this.character.shallowCopy()
    this.sleep = false

    this.sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, this.asset)
    this.sprite.setFlipX(Direction[this.character.initialDirection].dx < 0)
    this.sleepSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'sleep_zzz')
    this.sleepSprite.depth = 1
    this.sleepSprite.setVisible(false)
    this.calculationSprite = null

    this.itemContainer = new Phaser.GameObjects.Container(scene, 0, itemContainerInitialY)
    this.updateItem()

    this.scene.add.existing(this.sprite)
    this.scene.add.existing(this.sleepSprite)
    this.scene.add.existing(this.itemContainer)
    this.add(this.sprite)
    this.add(this.sleepSprite)
    this.add(this.itemContainer)

    this.setSize(this.sprite.width, this.sprite.height)
    this.playAnimation()
  }

  playAnimation() {
    this.sprite.play(`${this.asset}_${this.actionState}`)

    this.playItemContainerAnimation()
  }

  playItemContainerAnimation() {
    if (this.itemContainerTween) {
      this.itemContainerTween.stop()
      this.itemContainerTween = null
    }

    if (this.actionState === stateIdle) {
      this.itemContainer.y = itemContainerInitialY
      let time1 = Date.now()
      this.itemContainerTween = this.scene.tweens.add({
        targets: this.itemContainer,
        y: itemContainerInitialY + 4,
        duration: 4 * 1000 / 12,
        repeat: Infinity,
        repeatDelay: 0.00000000001,
        ease: function(v) {
          v += 0.05
          v = v % 1
          if (v <= 0.25) {
            v = 0
          } else if (v <= 0.5) {
            v = 0.5
          } else if (v <= 0.75) {
            v = 1
          } else {
            v = 0.5
          }
          return v
        }
      })
    } else if (this.actionState === stateRun) {
      let time2 = Date.now()
      this.itemContainer.y = itemContainerInitialY - 4
      this.itemContainerTween = this.scene.tweens.add({
        targets: this.itemContainer,
        y: itemContainerInitialY,
        duration: 4 * 1000 / 12,
        repeat: Infinity,
        ease: function(v) {
          v += 0.05
          v = v % 1
          if (v <= 0.25) {
            v = 0.5
          } else if (v <= 0.5) {
            v = 0
          } else if (v <= 0.75) {
            v = 0.5
          } else {
            v = 1
          }
          return v
        }
      })
    } else if (this.actionState === stateSleep) {
      this.itemContainer.y = -8
    }
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
    } else if (this.hasJustBeenCloned()) {
      this.playClonedAnimation()
    }

    if (!this.character.ai.hasStepAvailable() && !this.scene.runner.world.hasWon) {
      this.sleep = true
    }

    if (!this.dead && this.character.dead) {
      this.dead = this.character.dead
      this.emit('die', this)
      if (this.character.deathReason === CharacterDeathReason.burnt ||
        this.character.deathReason === CharacterDeathReason.spikes ||
        this.character.deathReason === CharacterDeathReason.touchedEnemy ||
        this.character.deathReason === CharacterDeathReason.failedCloning) {
        let delay = this.character.deathReason === CharacterDeathReason.burnt ||
          this.character.deathReason === CharacterDeathReason.failedCloning ? 200 : 0
        setTimeout(() => {
          // Check if destroyed
          if (this.scene) {
            this.sprite.play('ashes', true)
          }
        }, delay)
        this.scene.soundManager.play(this.getScreamAsset())
      }
      this.depthOffset = -14
    }

    this.updateState()
    this.dead = this.character.dead
    this.lastCharacter = this.character.shallowCopy()
  }

  afterStep(world) {
    if (this.character.lastAction) {
      let action = this.character.lastAction
      if (action.type === 'StepAction') {
        this.emit('step-to', this, action.direction)
      }
    }

    if (this.character.ai &&
      this.character.ai.context) {
      if (this.character.ai.context.observations &&
        this.character.ai.context.observations.length > 0) {
        this.emit('observe', this, this.character.ai.context.observations)
        this.scene.updateCharacterObservations(this, this.character.ai.context.observations)
      }

      this.hideCalculation()
      if (this.character.ai.context.calculation) {
        this.showCalculation(this.character.ai.context.calculation)
      }
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

  hasJustBeenCloned() {
    let world = this.scene.runner.world
    let clonedCharacterEvents = world.eventLog.search({
      step: world.steps,
      type: 'character-cloning',
      cloneID: this.character.id,
    })
    return clonedCharacterEvents.length > 0
  }

  playClonedAnimation() {
    const stepInterval = this.scene.runner.stepInterval
    if (stepInterval > 100) {
      this.brightness = 0
      this.sprite.alpha = 0
      this.sprite.scale = 0.1

      let spriteTween = this.scene.tweens.add({
        targets: this.sprite,
        tint: 0xffffff,
        alpha: 1,
        scale: 1,
        ease: 'Quad.easeOut',
        duration: stepInterval / 2
      })
      let brightnessTween = this.scene.tweens.add({
        targets: this,
        brightness: 0xff,
        ease: 'Quad.easeIn',
        duration: stepInterval / 1.5
      })
    }
  }

  updateItem() {
    if (this.itemContainer.length > 0) {
      if (!this.lastCharacter.item) {
        let itemSprite = this.itemContainer.getAt(0)
        this.itemContainer.removeAll()
        this.scene.add.existing(itemSprite)
      }
    } else {
      if (this.lastCharacter.item) {
        let itemSprite = this.scene.getItemSprite(this.lastCharacter.item.id)
        this.itemContainer.add(itemSprite)
        itemSprite.x = 0
        itemSprite.y = 0
      }
    }
  }

  showCalculation(calculation) {
    this.calculationSprite = new CalculationS(this.scene, calculation)
    this.calculationSprite.y = -18
    this.scene.add.existing(this.calculationSprite)
    this.add(this.calculationSprite)
  }

  hideCalculation() {
    if (this.calculationSprite) {
      this.calculationSprite.destroy()
      this.calculationSprite = null
    }
  }

  updateBrightness() {
    const brightness = Math.round(this.brightness)
    this.sprite.tint = brightness * 0x10000 + brightness * 0x100 + brightness
  }

  updateDepth() {
    this.depth = (this.y - this.offsetY) + this.depthOffset
  }

  update() {
    this.updateBrightness()
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
      this.scene.soundManager.play(this.getScreamAsset(), {
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