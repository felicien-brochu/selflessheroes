import CharacterAction from './CharacterAction'

export default class TakeAction extends CharacterAction {
  constructor(direction) {
    super('TakeAction')
    this.direction = direction
  }
}