import AI from './AI'
import {
  WaitAction
} from '../CharacterAction'

export default class JavascriptAI extends AI {
  constructor(world, character, code) {
    super(world, character)

    this.code = code
    this.func = new Function(this.code)
  }

  step(rng) {
    return this.func()
  }
}