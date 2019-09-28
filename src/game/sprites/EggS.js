import Phaser from 'phaser'

const minStepIntervalAnims = 0

export default class EggS extends Phaser.GameObjects.Container {
  constructor(scene, egg, tileWidth, tileHeight, offsetX = 0, offsetY = -3) {
    let x = (egg.x + 0.5) * tileWidth + offsetX,
      y = (egg.y + 0.5) * tileHeight + offsetY
    super(scene, x, y)

    this.offsetX = offsetX
    this.offsetY = offsetY
    this.tileWidth = tileWidth
    this.tileHeight = tileHeight
    this.depthOffset = 1
    this.updateDepth()

    this.egg = egg
    this.lastEgg = egg.shallowCopy()

    this.moveTimelines = {
      x: null,
      y: null
    }
    this.moving = false


    this.sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'egg')
    this.sprite.setScale(0.85)

    this.textSprite = new Phaser.GameObjects.BitmapText(scene, 0, 0, 'digits_font')
    this.updateText(this.egg.value)

    this.writeSmokeSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'write_smoke')
    this.writeSmokeSprite.setFrame(4)

    this.lotteryIntervalID = -1
    if (this.egg.showLottery && this.egg.hasValueGenerator()) {
      this.startValueLottery()
    }

    this.scene.add.existing(this.sprite)
    this.scene.add.existing(this.textSprite)
    this.scene.add.existing(this.writeSmokeSprite)
    this.add(this.sprite)
    this.add(this.textSprite)
    this.add(this.writeSmokeSprite)
    this.setSize(this.sprite.width, this.sprite.height)

    this.tweenPool = []
  }

  beforeStep(world) {
    if (world.steps === 0 && this.lotteryIntervalID !== -1) {
      this.stopLottery()
    }

    this.handleWriteActions(world)
    this.handleDropInCauldron(world)

    if (!this.egg.owner) {
      if (this.lastEgg.ownerID) {
        this.handleDroppedByOwner(world)
      } else {
        this.setNormalPosition()
      }
    } else if (!this.lastEgg.ownerID) {
      this.handleTakenByOwner(world)
    }

    this.lastEgg = this.egg.shallowCopy()
    this.updateText(this.egg.value)
  }

  afterStep(world) {}

  setNormalPosition() {
    this.x = (this.egg.x + 0.5) * this.tileWidth + this.offsetX
    this.y = (this.egg.y + 0.5) * this.tileHeight + this.offsetY
  }

  handleWriteActions(world) {
    // Check for write action in event log
    let writeLogs = world.eventLog.search({
      type: 'egg-write',
      step: world.steps,
      eggID: this.egg.id
    })
    if (writeLogs.length > 0) {
      this.writeSmokeSprite.play('write_smoke')
    }
  }

  handleDropInCauldron(world) {
    // Check for drop in cauldron in event log
    let cauldronDropLogs = world.eventLog.search({
      type: 'put-item-cauldron',
      step: world.steps,
      itemID: this.egg.id
    })
    if (cauldronDropLogs.length > 0) {
      this.scene.soundManager.play('cauldron_drop_sfx')
    }
  }

  handleDroppedByOwner(world) {
    let characterSprite = this.scene.getCharacterSprite(this.lastEgg.ownerID)
    this.x = characterSprite.x + characterSprite.itemContainer.x
    this.y = characterSprite.y + characterSprite.itemContainer.y
    characterSprite.updateItem()

    let x = (this.egg.x + 0.5) * this.tileWidth + this.offsetX
    let y = (this.egg.y + 0.5) * this.tileHeight + this.offsetY

    const stepInterval = this.scene.runner.stepInterval
    const justRemoved = !this.removed && this.egg.removed
    let fellInHole = false

    if (justRemoved) {
      // Check if the egg fell in a hole in event log
      let fellLogs = world.eventLog.search({
        type: 'egg-fell-in-hole',
        step: world.steps,
        eggID: this.egg.id
      })
      fellInHole = fellLogs.length > 0
    }

    if (stepInterval > minStepIntervalAnims) {
      this.startDropAnimation(x, y, justRemoved, fellInHole)
    } else {
      this.x = x
      this.y = y

      if (justRemoved) {
        this.alpha = 0
      }
    }
  }

  startDropAnimation(x, y, justRemoved, fellInHole) {
    this.killAllTweens(false)
    const stepInterval = this.scene.runner.stepInterval
    this.path = new Phaser.Curves.Path(this.x, this.y)

    let bump = -30
    const droppedDownward = this.egg.y >= this.lastEgg.y
    if (droppedDownward) {
      bump = 0
    }
    if (fellInHole) {
      if (!droppedDownward) {
        bump = -50
      }
      // Modify path to fall beneath the ground
      y += 32
    }

    this.path.cubicBezierTo(x, y, this.x, this.y + bump, x, y - 100)
    this.follower = {
      t: 0,
      vec: new Phaser.Math.Vector2()
    }
    const maxDuration = Math.min(Math.max(stepInterval / 1.5, 200), stepInterval)
    const constPortion = 300
    let duration = (this.path.getCurveLengths()[0] + constPortion) / (100 + constPortion) * stepInterval / 1.5
    duration = Math.min(duration, maxDuration)

    let tween = this.scene.tweens.add({
      targets: this.follower,
      t: 1,
      ease: 'Quad.easeInOut',
      duration: duration
    })

    this.moving = true
    this.tweenPool.push(tween)
    tween.on('complete', this.onTweenComplete, this)

    if (justRemoved) {
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        ease: fellInHole ? 'Quad.easeIn' : 'Stepped',
        delay: fellInHole ? duration / 2 : duration,
        duration: fellInHole ? duration / 4 : 0,
      })
    }
  }

  handleTakenByOwner(world) {
    const stepInterval = this.scene.runner.stepInterval
    let characterSprite = this.scene.getCharacterSprite(this.egg.owner.id)
    let x = characterSprite.x + characterSprite.itemContainer.x
    let y = characterSprite.y + characterSprite.itemContainer.y

    if (stepInterval > minStepIntervalAnims) {
      this.startTakenAnimation(x, y)

    } else {
      this.x = x
      this.y = y
      characterSprite.updateItem()
    }
  }

  afterTakenAnimation() {
    let characterSprite = this.scene.getCharacterSprite(this.lastEgg.ownerID)
    characterSprite.updateItem()
  }

  startTakenAnimation(x, y) {
    this.killAllTweens(false)
    const stepInterval = this.scene.runner.stepInterval
    this.path = new Phaser.Curves.Path(this.x, this.y)
    this.path.cubicBezierTo(x, y, this.x, this.y, x, y - 50)
    this.follower = {
      t: 0,
      vec: new Phaser.Math.Vector2()
    }

    const maxDuration = Math.min(Math.max(stepInterval / 1.5, 200), stepInterval)
    const constPortion = 300
    let duration = (this.path.getCurveLengths()[0] + constPortion) / (100 + constPortion) * stepInterval / 1.5
    duration = Math.min(duration, maxDuration)

    let tween = this.scene.tweens.add({
      targets: this.follower,
      t: 1,
      ease: 'Quad.easeInOut',
      duration: duration
    })
    this.moving = true

    this.tweenPool.push(tween)
    tween.on('complete', this.onTweenComplete, this)
  }

  startValueLottery() {
    const lottery = () => {
      let newValue
      do {
        newValue = this.egg.generateValue(Math.random)
      } while (newValue == this.egg.value)
      this.updateText(newValue)
    }
    lottery()
    this.lotteryIntervalID = setInterval(lottery, 500)
  }

  stopLottery() {
    if (this.lotteryIntervalID !== -1) {
      clearInterval(this.lotteryIntervalID)
      this.lotteryIntervalID = -1
      this.updateText(this.egg.value)
    }
  }

  updateText(value) {
    let text = value.toString()
    let length = text.length > 3 ? 3 : text.length
    text = text.substring(text.length - length)

    if (text !== this.textSprite.text) {
      this.textSprite.setText(text)

      let fontSize
      if (text.length < 2) {
        fontSize = 8
      } else if (text.length < 3) {
        fontSize = 7
      } else {
        fontSize = 6
      }

      this.textSprite.setFontSize(fontSize)
      this.textSprite.setDisplayOrigin((this.textSprite.width - fontSize / 5) / 2, fontSize / 2)
    }
  }

  onTweenComplete(tween) {
    if (this.tweenPool.includes(tween)) {
      this.tweenPool.splice(this.tweenPool.indexOf(tween), 1)
    }

    this.updatePathPosition()
    this.moving = false
    if (this.lastEgg.ownerID !== null) {
      this.afterTakenAnimation()
    }
  }

  killAllTweens(removeListeners = true) {
    this.tweenPool.forEach(tween => {
      if (removeListeners) {
        tween.off('complete')
      }
      tween.stop()
    })
    this.tweenPool = []
  }

  updateDepth() {
    this.depth = (this.y - this.offsetY) + this.depthOffset
    if (this.moving) {
      this.depth += 100
    }
  }

  update() {
    this.updateDepth()
  }

  preUpdate(time, delta) {
    if (this.moving) {
      this.updatePathPosition()
    }
  }

  updatePathPosition() {
    this.path.getPoint(this.follower.t, this.follower.vec)
    this.x = this.follower.vec.x
    this.y = this.follower.vec.y
    this.updateDepth()
  }

  destroy(fromScene) {
    this.killAllTweens(true)
    this.stopLottery()
    super.destroy(fromScene)
  }
}