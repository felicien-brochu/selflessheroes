export default class PathFinder {

  constructor(collides, width, height) {
    this.collides = collides

    this.map = []
    for (var i = 0; i < height; i++) {
      let row = []
      for (var j = 0; j < width; j++) {
        row.push(collides(j, i) ? 0 : Infinity)
      }
      this.map.push(row)
    }
  }

  findPath(start, end) {
    let path = []

    let res = this.buildRec(start, end, 0, [])
    if (res) {
      path = res[0]
    }

    return path
  }

  buildRec({
    x,
    y
  }, end, length, path) {
    let map = this.map
    path.push([x, y])
    if (x === end.x && y === end.y) {
      return [path, length]
    }
    map[y][x] = length
    length++
    let min = Infinity
    let res = null
    if (map[y][x + 1] > length) {
      let r = this.buildRec({
        x: x + 1,
        y: y
      }, end, length, path.slice(0))
      if (r !== null && r[1] < min) {
        res = r
        min = r[1]
      }
    }
    if (map[y][x - 1] > length) {
      let r = this.buildRec({
        x: x - 1,
        y: y
      }, end, length, path.slice(0))
      if (r !== null && r[1] < min) {
        res = r
        min = r[1]
      }
    }
    if (map[y + 1][x] > length) {
      let r = this.buildRec({
        x: x,
        y: y + 1
      }, end, length, path.slice(0))
      if (r !== null && r[1] < min) {
        res = r
        min = r[1]
      }
    }
    if (map[y - 1][x] > length) {
      let r = this.buildRec({
        x: x,
        y: y - 1
      }, end, length, path.slice(0))
      if (r !== null && r[1] < min) {
        res = r
        min = r[1]
      }
    }
    return res
  }
}