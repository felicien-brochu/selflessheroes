import AI from './AI'
import PathFinderAI from './PathFinderAI'

export default class SwitchFinderAI extends AI {
  constructor(world, character) {
    super(world, character)

    this.pathFinder = null
    this.switchIndex = -1

    this.nextSwitch()
  }

  step(rng) {
    if ((this.pathFinder.isDone() || this.world.switches[this.switchIndex].isEnabled()) && this.switchIndex < this.world.switches.length - 1) {
      this.nextSwitch()
    }
    return this.pathFinder.step()
  }

  nextSwitch() {
    this.switchIndex++
    if (this.switchIndex >= this.world.switches.length) {
      throw new Error("No more switches to find. You must not call this function if there is no more switches to find.")
    }

    let mySwitch = this.world.switches[this.switchIndex]
    this.pathFinder = new PathFinderAI(this.world, this.character, mySwitch.x, mySwitch.y)
  }

}