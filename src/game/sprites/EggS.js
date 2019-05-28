import Phaser from 'phaser'

export default class EggS extends Phaser.GameObjects.Container {
  constructor(scene, egg, tileWidth, tileHeight, offsetX = 0, offsetY = -1) {
    let x = (egg.x + 0.5) * tileWidth + offsetX,
      y = (egg.y + 0.5) * tileHeight + offsetY
    super(scene, x, y)

    this.offsetX = offsetX
    this.offsetY = offsetY
    this.depthOffset = 1
    this.updateDepth()
    this.egg = egg

    this.sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'egg')
    this.sprite.setScale(0.85)

    this.textSprite = new Phaser.GameObjects.BitmapText(scene, 0, 0, 'digits_font')
    this.updateText()

    this.scene.add.existing(this.sprite)
    this.scene.add.existing(this.textSprite)
    this.add(this.sprite)
    this.add(this.textSprite)
    this.setSize(this.sprite.width, this.sprite.height)
  }

  beforeStep(world) {}

  afterStep(world) {}

  updateText() {
    let text = this.egg.value.toString()
    let length = text.length > 3 ? 3 : text.length
    text = text.substring(text.length - length)
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

  updateDepth() {
    this.depth = (this.y - this.offsetY) + this.depthOffset
  }

  update() {
    this.updateDepth()
  }
}