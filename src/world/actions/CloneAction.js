import CharacterAction from './CharacterAction'

export default class CloneAction extends CharacterAction {
  constructor(direction, anchorStatement, deadly) {
    super('CloneAction')
    this.direction = direction
    this.anchorStatement = anchorStatement
    this.deadly = deadly
  }
}