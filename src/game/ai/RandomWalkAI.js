import AI from './AI'
import StepAction from '../actions/StepAction'
import Direction from '../Direction'

export default class RandomWalkAI extends AI {
  constructor(world, character) {
    super(world, character)
  }

  step() {
    let r = Math.random()
    let dir = r > 0.75 ? Direction.n : r > 0.5 ? Direction.e : r > 0.25 ? Direction.s : Direction.w
    return new StepAction(dir)
  }

}