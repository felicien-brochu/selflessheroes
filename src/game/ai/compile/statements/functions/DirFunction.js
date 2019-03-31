import Function from './Function'
import ExpressionTypes from '../ExpressionTypes'
import ExpressionValue from '../ExpressionValue'

const identifier = 'dir'

const allowedParams = [
  'hr', // Here
  'n', // North
  'ne', // North East
  'e', // East
  'se', // South East
  's', // South
  'sw', // South West
  'w', // West
  'nw' // North West
]

export default class DirFunction extends Function {
  static getIdentifier() {
    return identifier
  }

  static checkParams(params, config) {
    return params.length === 1 && allowedParams.indexOf(params[0]) >= 0
  }

  static getReturnType() {
    return ExpressionTypes.composite
  }

  static call(context, params) {
    // TODO: dir function
    return ExpressionValue.composite([])
  }
}