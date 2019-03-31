import ActionFunction from './ActionFunction'

const identifier = 'step'

const allowedParams = [
  'n', // North
  'ne', // North East
  'e', // East
  'se', // South East
  's', // South
  'sw', // South West
  'w', // West
  'nw' // North West
]

export default class DirFunction extends ActionFunction {
  static getIdentifier() {
    return identifier
  }

  static checkParams(params, config) {
    return params.every(param => allowedParams.indexOf(param) >= 0)
  }

  static call(hero, world, params) {
    throw new Error('NOOP')
  }
}