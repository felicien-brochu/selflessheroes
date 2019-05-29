import CharacterAction from './CharacterAction'

export default class DropAction extends CharacterAction {
  constructor(direction) {
    super('DropAction')
    this.direction = direction
  }
}