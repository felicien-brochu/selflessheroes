import Phaser from 'phaser'
import ExpressionTypes from '../../world/ai/compile/statements/ExpressionTypes'
import ObjectType from '../../world/objects/ObjectType'
import TerrainType from '../../world/map/TerrainType'

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
    let value1 = this.calculation.operands[0].value
    if (value1.hasIntegerValue()) {
      value1 = this.formatInteger(value1.getFirstIntegerValue().value)
    } else {
      value1 = 0
    }

    let value2 = this.calculation.operands[2].value
    if (value2.hasIntegerValue()) {
      value2 = this.formatInteger(value2.getFirstIntegerValue().value)
    } else {
      value2 = 0
    }

    let text = this.calculation.variable.substring(1)
    text += ' = '
    text += value1 + ' '
    text += this.calculation.operands[1].value.toString() + ' '
    text += value2

    this.displayText(text)
  }

  buildSetContent() {
    let value = this.calculation.operands[0].value
    let text = this.calculation.variable.substring(1)
    text += ' = '

    this.displayText(text)
  }

  formatInteger(value) {
    let text = ''
    if (value >= 1e6 || value <= -1e6) {
      if (value >= 1e100) {
        text = '∞'
      } else if (value <= -1e100) {
        text = '-∞'
      } else {
        let exponent = Math.floor(Math.log10(Math.abs(value)))
        let base = Math.floor(value / (10 ** exponent))
        text = `${base}^${exponent}`
      }
    } else {
      text = value.toString()
    }
    return text
  }

  displayText(text) {
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


  isRawType(variable) {
    let type = variable.getDominantValue().type
    return type === ExpressionTypes.integer || type === ExpressionTypes.boolean
  }

  isIconType(variable) {
    let value = variable.getDominantValue()
    return value.type === ExpressionTypes.terrainType ||
      value.type === ExpressionTypes.objectType ||
      (value.type === ExpressionTypes.object &&
        value.value.type !== ObjectType.egg)
  }

  icon(variable) {
    let value = variable.getDominantValue()
    let icon = ''
    if (value.type === ExpressionTypes.object) {
      let obj = value.value
      if (obj.type === ObjectType.hero) {
        icon = `hero-${heroColors[obj.color % heroColors.length]}`
      } else {
        icon = `icon-${ObjectType.keyOf(obj.type)}`
      }
    } else if (value.type === ExpressionTypes.objectType) {
      icon = `icon-${ObjectType.keyOf(value.value)}`
    } else if (value.type === ExpressionTypes.terrainType) {
      icon = `icon-${TerrainType.keyOf(value.value)}`
    }

    return icon
  }

  isEgg(variable) {
    let value = variable.getDominantValue()
    return value.type === ExpressionTypes.object &&
      value.value.type === ObjectType.egg
  }

  eggDigits(variable) {
    let egg = variable.getDominantValue().value
    let text = egg.value.toString()
    let length = text.length > 2 ? 2 : text.length
    text = text.substring(text.length - length)
    return text
  }
}