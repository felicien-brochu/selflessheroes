import AI from './AI'
import WaitAction from '../actions/WaitAction'

export default class IdleAI extends AI {
  constructor(world, character) {
    super(world, character)
  }

  step(rng) {
    return new WaitAction()
  }
}