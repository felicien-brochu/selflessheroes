import AI from './AI'
import {
  WaitAction
} from '../CharacterAction'

export default class UserAI extends AI {
  constructor(world, character, code) {
    super(world, character)

    this.code = code
  }

  step() {
    return new Function(this.code)()
  }
}