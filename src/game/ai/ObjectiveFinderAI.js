import AI from './AI'
import PathFinderAI from './PathFinderAI'

export default class ObjectiveFinderAI extends AI {
  constructor(world, character) {
    super(world, character)

    this.pathFinder = null
    this.objectiveIndex = -1

    this.nextObjective()
  }

  step() {
    if ((this.pathFinder.isDone() || this.world.objectives[this.objectiveIndex].isEnabled()) && this.objectiveIndex < this.world.objectives.length - 1) {
      this.nextObjective()
    }
    return this.pathFinder.step()
  }

  nextObjective() {
    this.objectiveIndex++
    if (this.objectiveIndex >= this.world.objectives.length) {
      throw new Error("No more objectives to find. You must not call this function if there is no more objectives to find.")
    }

    let objective = this.world.objectives[this.objectiveIndex]
    this.pathFinder = new PathFinderAI(this.world, this.character, objective.x, objective.y)
  }

}