import Phaser from 'phaser'
import ExpressionTypes from '../../world/ai/compile/statements/ExpressionTypes'
import ObjectType from '../../world/objects/ObjectType'
import TerrainType from '../../world/map/TerrainType'
import heroColors from '../../shared/heroColors'

export default class CalculationS extends Phaser.GameObjects.Container {

  constructor(scene, calculation) {
    super(scene, 0, 0)

    this.calculation = calculation

    this.middleSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'calculation_middle')
    this.leftSprite = new Phaser.GameObjects.Sprite(scene, -20, 0, 'calculation_left')
    this.rightSprite = new Phaser.GameObjects.Sprite(scene, 20, 0, 'calculation_right')
    this.bubblesSprite = new Phaser.GameObjects.Sprite(scene, 12, 11.5, 'calculation_bubbles')

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
    const value = this.calculation.operands[0].value
    const dominantValue = value.getDominantValue()

    let text = this.calculation.variable.substring(1)
    text += ' = '

    if (this.isRawType(value)) {
      if (dominantValue.hasIntegerValue()) {
        text += this.formatInteger(dominantValue.getFirstIntegerValue().value)
      } else {
        text += dominantValue.value.toString()
      }
    } else {
      text += '          '

      if (this.isIconType(value)) {
        let valueSprite = new Phaser.GameObjects.Sprite(this.scene, 7, 0, this.getIcon(value))
        valueSprite.setScale(10 / valueSprite.width)
        this.add(valueSprite)
      } else if (this.isEgg(value)) {
        let eggSprite = new EggIconS(this.scene, 7.5, 0, dominantValue.value)
        eggSprite.setScale(0.5)
        this.add(eggSprite)
      }
    }

    this.leftSprite.x = -15
    this.rightSprite.x = 15
    this.middleSprite.setScale(4.3, 1)
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

  getIcon(variable) {
    let value = variable.getDominantValue()
    let icon = ''
    if (value.type === ExpressionTypes.object) {
      let obj = value.value
      if (obj.type === ObjectType.hero) {
        icon = `hero_${heroColors[obj.color % heroColors.length]}`
      } else {
        icon = `${ObjectType.keyOf(obj.type)}_icon`
      }
    } else if (value.type === ExpressionTypes.objectType) {
      icon = `${ObjectType.keyOf(value.value)}_icon`
    } else if (value.type === ExpressionTypes.terrainType) {
      icon = `${TerrainType.keyOf(value.value)}_icon`
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

class EggIconS extends Phaser.GameObjects.Container {
  constructor(scene, x, y, egg) {
    super(scene, x, y)
    this.egg = egg
    this.sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'egg_icon')
    this.sprite.setScale(0.48)

    this.textSprite = new Phaser.GameObjects.BitmapText(scene, 0, 0.5, 'digits_font')
    this.updateText(this.egg.value)

    this.add(this.sprite)
    this.add(this.textSprite)
  }

  updateText(value) {
    let text = this.formatInteger(value)

    if (text !== this.textSprite.text) {
      this.textSprite.setText(text)

      let fontSize
      if (text.length < 2) {
        fontSize = 8
      } else if (text.length < 3) {
        fontSize = 7
      } else {
        fontSize = 5
      }

      this.textSprite.setFontSize(fontSize)
      this.textSprite.setDisplayOrigin((this.textSprite.width - fontSize / 5) / 2, fontSize / 2)
      if (this.textSprite.width > 14) {
        this.textSprite.setScale(14 / this.textSprite.width)
      } else {
        this.textSprite.setScale(1)
      }
    }
  }

  formatInteger(value) {
    let text = ''
    if (value >= 1e3 || value <= -1e2) {
      if (value >= 1e10) {
        text = '∞'
      } else if (value <= -1e2) {
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
}