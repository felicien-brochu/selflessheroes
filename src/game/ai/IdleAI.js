import AI from './AI'
import {
  WaitAction
} from '../CharacterAction'

export default class IdleAI extends AI {
  constructor(world, character) {
    super(world, character)
  }

  step() {
    return new WaitAction()
  }
}