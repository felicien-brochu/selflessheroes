import ExpressionTypes from './ExpressionTypes'

export default class ExpressionValue {
  constructor(type, value) {
    this.type = type
    this.value = value
  }

  hasValueType(type) {
    return this.type === type || (this.type === ExpressionTypes.composite && this.value.some(val => val.type === type))
  }

  getFirstValueType(type) {
    let value = null
    if (this.type === type) {
      value = this.value
    } else if (this.type === ExpressionTypes.composite) {
      value = this.value.find(val => val.type === type)
      if (value) {
        value = value.value
      }
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
        value = this.getFirstValueType(type)
        if (value) {
          break
        }
      }
    }
    return value
  }

  hasBooleanValue() {
    return this.hasValueType(ExpressionTypes.boolean)
  }

  getFirstBooleanValue() {
    return this.getFirstValueType(ExpressionTypes.boolean)
  }

  hasIntegerValue() {
    return this.hasValueType(ExpressionTypes.integer)
  }

  getFirstIntegerValue() {
    return this.getFirstValueType(ExpressionTypes.integer)
  }

  hasObjectTypeValue() {
    return this.hasValueType(ExpressionTypes.objectType)
  }

  getFirstObjectTypeValue() {
    return this.getFirstValueType(ExpressionTypes.objectType)
  }

  hasTerrainTypeValue() {
    return this.hasValueType(ExpressionTypes.terrainType)
  }

  getFirstTerrainTypeValue() {
    return this.getFirstValueType(ExpressionTypes.terrainType)
  }

  hasDirectionValue() {
    return this.hasValueType(ExpressionTypes.direction)
  }

  getFirstDirectionValue() {
    return this.getFirstValueType(ExpressionTypes.direction)
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