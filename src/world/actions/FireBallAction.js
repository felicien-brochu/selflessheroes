import CharacterAction from './CharacterAction'

export default class FireBallAction extends CharacterAction {
  constructor(direction) {
    super('FireBallAction')
    this.direction = direction
  }
}