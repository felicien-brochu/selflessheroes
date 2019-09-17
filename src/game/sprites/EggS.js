import Phaser from 'phaser'

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
  }

  beforeStep(world) {
    if (world.steps === 0 && this.lotteryIntervalID !== -1) {
      this.stopLottery()
    }

    // Check for write action in event log
    let writeLogs = world.eventLog.search({
      type: 'egg-write',
      step: world.steps,
      eggID: this.egg.id
    })
    if (writeLogs.length > 0) {
      this.writeSmokeSprite.play('write_smoke')
    }

    if (!this.egg.owner) {
      let x = (this.egg.x + 0.5) * this.tileWidth + this.offsetX
      let y = (this.egg.y + 0.5) * this.tileHeight + this.offsetY

      if (this.lastEgg.ownerID) {
        let characterSprite = this.scene.getCharacterSprite(this.lastEgg.ownerID)
        this.x = characterSprite.x + characterSprite.itemContainer.x
        this.y = characterSprite.y + characterSprite.itemContainer.y
        characterSprite.updateItem()

        this.path = new Phaser.Curves.Path(this.x, this.y)
        let bump = this.y > y ? -50 : 0
        this.path.cubicBezierTo(x, y, this.x, this.y + bump, x, y - 100)
        this.follower = {
          t: 0,
          vec: new Phaser.Math.Vector2()
        }
        const maxDuration = Math.min(Math.max(this.scene.runner.stepInterval / 1.5, 200), this.scene.runner.stepInterval)
        const constPortion = 300
        let duration = (this.path.getCurveLengths()[0] + constPortion) / (100 + constPortion) * this.scene.runner.stepInterval / 1.5
        duration = Math.min(duration, maxDuration)

        let tween = this.scene.tweens.add({
          targets: this.follower,
          t: 1,
          ease: 'Quad.easeInOut',
          duration: duration
        })
        this.moving = true

        tween.setCallback('onComplete', () => this.onTweenComplete(), [])

        if (!this.removed && this.egg.removed) {
          this.scene.tweens.add({
            targets: this,
            alpha: 0,
            ease: 'Stepped',
            delay: duration
          })
        }

      } else {
        this.x = x
        this.y = y
      }
    } else if (!this.lastEgg.ownerID) {
      let characterSprite = this.scene.getCharacterSprite(this.egg.owner.id)

      this.path = new Phaser.Curves.Path(this.x, this.y)
      let x = characterSprite.x + characterSprite.itemContainer.x
      let y = characterSprite.y + characterSprite.itemContainer.y
      this.path.cubicBezierTo(x, y, this.x, this.y, x, y - 50)
      this.follower = {
        t: 0,
        vec: new Phaser.Math.Vector2()
      }

      const maxDuration = Math.min(Math.max(this.scene.runner.stepInterval / 1.5, 200), this.scene.runner.stepInterval)
      const constPortion = 300
      let duration = (this.path.getCurveLengths()[0] + constPortion) / (100 + constPortion) * this.scene.runner.stepInterval / 1.5
      duration = Math.min(duration, maxDuration)

      let tween = this.scene.tweens.add({
        targets: this.follower,
        t: 1,
        ease: 'Quad.easeInOut',
        duration: duration
      })
      this.moving = true

      tween.setCallback('onComplete', () => this.onTweenComplete(), [])
    }

    this.lastEgg = this.egg.shallowCopy()
    this.updateText(this.egg.value)
  }

  afterStep(world) {}

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

  onTweenComplete() {
    this.updatePathPosition()
    if (this.lastEgg.ownerID !== null) {
      let characterSprite = this.scene.getCharacterSprite(this.lastEgg.ownerID)
      characterSprite.updateItem()
    }
    this.moving = false
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

  destroy() {
    this.stopLottery()
    super.destroy()
  }
}