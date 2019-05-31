import ExpressionTypes from './ExpressionTypes'
import Direction from '../../../Direction'

export default class ExpressionValue {
  constructor(type, value) {
    this.type = type
    this.value = value
  }

  hasValueOfType(type) {
    return this.getValuesOfType(type).length > 0
  }

  getFirstValueOfType(type) {
    let values = this.getValuesOfType(type)
    if (values.length > 0) {
      return values[0]
    }
    return null
  }

  getValuesOfType(type) {
    let values = []
    if (this.type === ExpressionTypes.composite) {
      for (let value of this.value) {
        values.push(value.getValueOfType(type))
      }
    } else {
      values.push(this.getValueOfType(type))
    }

    return values.filter(v => !!v)
  }

  getValueOfType(type) {
    if (this.type === ExpressionTypes.composite) {
      if (type === ExpressionTypes.composite) {
        return this
      }
    } else {
      if (type === this.type) {
        return this
      } else if (this.type === ExpressionTypes.object) {
        if (type === ExpressionTypes.objectType) {
          return ExpressionValue.objectType(this.value.type)
        } else if (type === ExpressionTypes.integer && Number.isInteger(this.value.value)) {
          return ExpressionValue.integer(this.value.value)
        } else if (type === ExpressionTypes.boolean && typeof this.value.value === "boolean") {
          return ExpressionValue.boolean(this.value.value)
        } else if (type === ExpressionTypes.direction && this.value.value instanceof Direction) {
          return ExpressionValue.direction(this.value.value)
        } else if (this.value.item) {
          let item = this.value.item
          // Do not get objectType for items
          if (type === ExpressionTypes.integer && Number.isInteger(item.value)) {
            return ExpressionValue.integer(item.value)
          } else if (type === ExpressionTypes.boolean && typeof item.value === "boolean") {
            return ExpressionValue.boolean(item.value)
          } else if (type === ExpressionTypes.direction && item.value instanceof Direction) {
            return ExpressionValue.direction(item.value)
          }
        }
      }
    }

    return null
  }

  getDominantValue() {
    let value = this
    let typeDominance = [
      ExpressionTypes.object,
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

  hasObjectValue() {
    return this.hasValueOfType(ExpressionTypes.object)
  }

  getFirstObjectValue() {
    return this.getFirstValueOfType(ExpressionTypes.object)
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

  static object(value) {
    return new ExpressionValue(ExpressionTypes.object, value)
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