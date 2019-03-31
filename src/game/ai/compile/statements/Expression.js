import Statement from './Statement'

export default class Expression extends Statement {
  isValid(code) {
    throw new Error('Needs subclass implementation.')
  }
}