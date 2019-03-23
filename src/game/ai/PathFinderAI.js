import Character from '../Character'
import {
  MoveAction
} from '../CharacterAction'

export default class PathFinderAI {
  constructor(world, character) {
    this.world = world
    this.character = character
  }

  step() {
    if (!this.path) {
      this.buildPath()
    }
    let action
    if (this.pathIndex < this.path.length - 1) {
      action = new MoveAction(this.path[this.pathIndex + 1][0] - this.character.x, this.path[this.pathIndex + 1][1] - this.character.y)
      this.pathIndex++
    } else {
      let r = Math.random()
      action = r > 0.75 ? new MoveAction(0, 1) : r > 0.5 ? new MoveAction(1, 0) : r > 0.25 ? new MoveAction(0, -1) : new MoveAction(-1, 0)
    }
    return action
  }

  buildPath() {
    this.path = []
    this.objective = this.world.objectives[0]

    this.map = []
    for (var i = 0; i < this.world.map.height; i++) {
      let row = []
      for (var j = 0; j < this.world.map.width; j++) {
        row.push(this.world.map.isInside(j, i))
      }
      this.map.push(row)
    }

    this.buildRec(this.character.x, this.character.y)
    this.pathIndex = 0
  }

  buildRec(x, y) {
    if (!this.map[y][x]) {
      return false
    }
    this.path.push([x, y])
    if (x === this.objective.x && y === this.objective.y) {
      return true
    }
    this.map[y][x] = false
    if (!this.buildRec(x + 1, y) && !this.buildRec(x, y + 1) && !this.buildRec(x - 1, y) && !this.buildRec(x, y - 1)) {
      this.path.pop()
      return false
    } else {
      return true
    }
  }
}