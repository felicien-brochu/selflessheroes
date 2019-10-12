import Phaser from 'phaser'

export default class CalculationS extends Phaser.GameObjects.Container {

  constructor(scene, calculation) {
    super(scene, 0, 0)

    this.calculation = calculation

    this.middleSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'calculation_middle')
    this.leftSprite = new Phaser.GameObjects.Sprite(scene, -20, 0, 'calculation_left')
    this.rightSprite = new Phaser.GameObjects.Sprite(scene, 20, 0, 'calculation_right')
    this.bubblesSprite = new Phaser.GameObjects.Sprite(scene, 12, 11.5, 'calculation_bubbles')

    this.scene.add.existing(this.middleSprite)
    this.scene.add.existing(this.leftSprite)
    this.scene.add.existing(this.rightSprite)
    this.scene.add.existing(this.bubblesSprite)

    this.add(this.middleSprite)
    this.add(this.leftSprite)
    this.add(this.rightSprite)
    this.add(this.bubblesSprite)

    this.middleSprite.setScale(6, 1)

    this.buildContent()
  }

  buildContent() {
    if (this.calculation.type === 'calc') {
      this.buildCalcContent()
    } else if (this.calculation.type === 'set') {
      this.buildSetContent()
    }
  }

  buildCalcContent() {
    let value1 = this.calculation.operands[0].value.getFirstIntegerValue().value
    let value2 = this.calculation.operands[2].value.getFirstIntegerValue().value

    value1 = value1 > 1e6 ? '∞' : value1 < -1e6 ? '-∞' : value1.toString()
    value2 = value2 > 1e6 ? '∞' : value2 < -1e6 ? '-∞' : value2.toString()

    let text = this.calculation.variable.substring(1)
    text += ' = '
    text += value1 + ' '
    text += this.calculation.operands[1].value.toString() + ' '
    text += value2

    let textSprite = new Phaser.GameObjects.BitmapText(this.scene, 0, 0, 'digits_font')
    textSprite.setText(text)

    const fontSize = 5.6
    textSprite.setFontSize(fontSize)
    textSprite.setDisplayOrigin((textSprite.width - fontSize / 5) / 2, fontSize / 2)
    if (textSprite.width > 36) {
      textSprite.setScale(36 / textSprite.width)
    }

    this.add(textSprite)
  }

  buildSetContent() {

  }
}