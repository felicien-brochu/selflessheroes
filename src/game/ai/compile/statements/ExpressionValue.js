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
    let value
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

  static boolean(value) {
    return new ExpressionValue(ExpressionTypes.boolean, value)
  }

  static integer(value) {
    return new ExpressionValue(ExpressionTypes.integer, value)
  }

  static objectType(value) {
    return new ExpressionValue(ExpressionTypes.objectType, value)
  }

  static composite(value) {
    return new ExpressionValue(ExpressionTypes.composite, value)
  }
}