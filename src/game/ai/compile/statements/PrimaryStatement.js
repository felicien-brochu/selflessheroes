import Statement from './Statement'

export default class PrimaryStatement extends Statement {
  isCodeComplete() {
    throw new Error('Needs subclass implementation.')
  }

  static matchLine(line) {
    throw new Error('Needs subclass implementation.')
  }
}