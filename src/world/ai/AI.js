export default class AI {
  constructor(world, character) {
    this.world = world
    this.character = character
  }

  step() {
    throw new Error('Needs subclass implementation')
  }
}