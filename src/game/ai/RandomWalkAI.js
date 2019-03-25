import AI from './AI'
import {
  MoveAction
} from '../CharacterAction'

export default class RandomWalkAI extends AI {
  constructor(world, character) {
    super(world, character)
  }

  step() {
    let r = Math.random()
    return r > 0.75 ? new MoveAction(0, 1) : r > 0.5 ? new MoveAction(1, 0) : r > 0.25 ? new MoveAction(0, -1) : new MoveAction(-1, 0)
  }

}