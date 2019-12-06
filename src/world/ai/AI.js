import StepPriority from './StepPriority'

export default class AI {
  constructor(world, character) {
    this.world = world
    this.character = character
  }

  step(rng) {
    throw new Error('Needs subclass implementation')
  }

  getStepPriority() {
    return StepPriority.NORMAL
  }

  getDebugContext() {
    return {
      character: this.character.shallowCopy(),
    }
  }

  hasStepAvailable() {
    return true
  }
}