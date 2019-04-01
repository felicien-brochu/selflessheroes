import CharacterAction from './CharacterAction'

export default class StepAction extends CharacterAction {
  constructor(direction) {
    super('StepAction')
    this.direction = direction
  }
}