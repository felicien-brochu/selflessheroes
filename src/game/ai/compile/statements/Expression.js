import Statement from './Statement'

export default class Expression extends Statement {
  computeValue(context) {
    throw new Error('Needs subclass implementation')
  }
}