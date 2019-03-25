import AI from './AI'
import Character from '../Character'
import {
  MoveAction
} from '../CharacterAction'

export default class DumbPathFinderAI extends AI {
  constructor(world, character, x, y) {
    super(world, character)
    this.objectiveX = x
    this.objectiveY = y

    this.buildPath()
  }

  step() {
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
    if (x === this.objectiveX && y === this.objectiveY) {
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

  isDone() {
    return this.pathIndex >= this.path.length - 1
  }
}