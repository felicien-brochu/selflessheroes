import AI from './AI'
import Character from '../Character'
import {
  MoveAction,
  WaitAction
} from '../CharacterAction'

export default class PathFinderAI extends AI {
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
      action = new WaitAction()
    }
    return action
  }

  buildPath() {
    this.path = []

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
    if (x === this.objectiveX && y === this.objectiveY) {
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

  isDone() {
    return this.pathIndex >= this.path.length - 1
  }
}