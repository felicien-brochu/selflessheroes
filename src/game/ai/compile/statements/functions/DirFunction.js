import Function from './Function'

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
    // For step
    // return params.every(param => allowedParams.indexOf(param) >= 0)
  }

  static getReturnType() {
    throw new Error('NOOP')
  }

  static call(hero, world, params) {
    throw new Error('NOOP')
  }
}