import CharacterAction from './CharacterAction'

export default class WriteAction extends CharacterAction {
  constructor(value) {
    super('WriteAction')
    this.value = value
  }
}