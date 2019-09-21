export default class Direction {
  constructor(dx, dy) {
    this.dx = dx
    this.dy = dy
  }

  setForced(dx, dy) {
    this._dx = dx
    this._dy = dy
  }

  get dx() {
    return this._dx
  }

  set dx(dx) {
    if (dx !== 0 && Math.abs(dx) > 1) {
      dx = Math.sign(dx)
    }
    this._dx = dx
  }

  get dy() {
    return this._dy
  }

  set dy(dy) {
    if (dy !== 0 && Math.abs(dy) > 1) {
      dy = Math.sign(dy)
    }
    this._dy = dy
  }

  equals(dir) {
    return this.dx === dir.dx && this.dy === dir.dy
  }

  getName() {
    for (let name of Direction.names) {
      if (this.equals(Direction[name])) {
        return name
      }
    }
    return ''
  }
}

Direction.here = new Direction(0, 0)
Direction.n = new Direction(0, -1)
Direction.ne = new Direction(1, -1)
Direction.e = new Direction(1, 0)
Direction.se = new Direction(1, 1)
Direction.s = new Direction(0, 1)
Direction.sw = new Direction(-1, 1)
Direction.w = new Direction(-1, 0)
Direction.nw = new Direction(-1, -1)

Direction.names = [
  'here',
  'n',
  'ne',
  'e',
  'se',
  's',
  'sw',
  'w',
  'nw',
]