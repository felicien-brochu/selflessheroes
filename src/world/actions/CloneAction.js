import CharacterAction from './CharacterAction'

export default class CloneAction extends CharacterAction {
  constructor(direction, config, deadly) {
    super('CloneAction')
    this.direction = direction
    this.config = config
    this.deadly = deadly
  }
}