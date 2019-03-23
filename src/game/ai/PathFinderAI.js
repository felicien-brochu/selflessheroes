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
        row.push(this.world.map.isInside(j, i) ? 1000000000 : 0)
      }
      this.map.push(row)
    }

    this.path = this.buildRec(this.character.x, this.character.y, 0, [])[0]
    this.pathIndex = 0

    for (var i = 0; i < this.map.length; i++) {
      let l = ""
      for (var j = 0; j < this.map[i].length; j++) {
        l += this.map[i][j] + ", "
      }
    }
  }

  buildRec(x, y, length, path) {
    let map = this.map
    path.push([x, y])
    if (x === this.objective.x && y === this.objective.y) {
      return [path, length]
    }
    map[y][x] = length
    length++
    let min = 1000000000000000000000
    let res = null
    if (map[y][x + 1] > length) {
      let r = this.buildRec(x + 1, y, length, path.slice(0))
      if (r !== null && r[1] < min) {
        res = r
        min = r[1]
      }
    }
    if (map[y][x - 1] > length) {
      let r = this.buildRec(x - 1, y, length, path.slice(0))
      if (r !== null && r[1] < min) {
        res = r
        min = r[1]
      }
    }
    if (map[y + 1][x] > length) {
      let r = this.buildRec(x, y + 1, length, path.slice(0))
      if (r !== null && r[1] < min) {
        res = r
        min = r[1]
      }
    }
    if (map[y - 1][x] > length) {
      let r = this.buildRec(x, y - 1, length, path.slice(0))
      if (r !== null && r[1] < min) {
        res = r
        min = r[1]
      }
    }
    return res
  }
}