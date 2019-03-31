export default class Function {
  static getIdentifier() {
    throw new Error('Needs subclass implementation.')
  }

  static checkParams(params, config) {
    throw new Error('Needs subclass implementation.')
  }

  static getReturnType() {
    throw new Error('Needs subclass implementation.')
  }

  static call(params, context) {
    throw new Error('Needs subclass implementation.')
  }
}