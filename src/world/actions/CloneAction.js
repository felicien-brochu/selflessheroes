import CharacterAction from './CharacterAction'

export default class CloneAction extends CharacterAction {
  constructor(direction, anchorStatement) {
    super('CloneAction')
    this.direction = direction
    this.anchorStatement = anchorStatement
  }
}