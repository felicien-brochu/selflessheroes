import ExpressionTypes from './ExpressionTypes'

export default class ExpressionValue {
  constructor(type, value) {
    this.type = type
    this.value = value
  }

  hasValueOfType(type) {
    return this.type === type || (this.type === ExpressionTypes.composite && this.value.some(val => val.type === type))
  }

  getFirstValueOfType(type) {
    let value = null
    if (this.type === type) {
      value = this
    } else if (this.type === ExpressionTypes.composite) {
      value = this.value.find(val => val.type === type)
    }
    return value
  }

  getDominantValue() {
    let value = this
    let typeDominance = [
      ExpressionTypes.objectType,
      ExpressionTypes.terrainType,
      ExpressionTypes.direction,
      ExpressionTypes.integer,
      ExpressionTypes.boolean,
    ]

    if (this.type === ExpressionTypes.composite) {
      for (let type of typeDominance) {
        value = this.getFirstValueOfType(type)
        if (value) {
          break
        }
      }
    }
    return value
  }

  hasBooleanValue() {
    return this.hasValueOfType(ExpressionTypes.boolean)
  }

  getFirstBooleanValue() {
    return this.getFirstValueOfType(ExpressionTypes.boolean)
  }

  hasIntegerValue() {
    return this.hasValueOfType(ExpressionTypes.integer)
  }

  getFirstIntegerValue() {
    return this.getFirstValueOfType(ExpressionTypes.integer)
  }

  hasObjectTypeValue() {
    return this.hasValueOfType(ExpressionTypes.objectType)
  }

  getFirstObjectTypeValue() {
    return this.getFirstValueOfType(ExpressionTypes.objectType)
  }

  hasTerrainTypeValue() {
    return this.hasValueOfType(ExpressionTypes.terrainType)
  }

  getFirstTerrainTypeValue() {
    return this.getFirstValueOfType(ExpressionTypes.terrainType)
  }

  hasDirectionValue() {
    return this.hasValueOfType(ExpressionTypes.direction)
  }

  getFirstDirectionValue() {
    return this.getFirstValueOfType(ExpressionTypes.direction)
  }

  static boolean(value) {
    return new ExpressionValue(ExpressionTypes.boolean, value)
  }

  static integer(value) {
    return new ExpressionValue(ExpressionTypes.integer, value)
  }

  static objectType(value) {
    return new ExpressionValue(ExpressionTypes.objectType, value)
  }

  static terrainType(value) {
    return new ExpressionValue(ExpressionTypes.terrainType, value)
  }

  static direction(value) {
    return new ExpressionValue(ExpressionTypes.direction, value)
  }

  static composite(value) {
    return new ExpressionValue(ExpressionTypes.composite, value)
  }
}