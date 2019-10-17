export default class PathFinder {

  constructor(collides, width, height, searchWindow) {
    this.collides = collides
    this.xOffset = 0
    this.yOffset = 0
    this.width = width
    this.height = height
    this.searchWindow = searchWindow

    if (searchWindow) {
      this.initWindow()
    }

    this.map = []
    this.initMap()
  }

  initWindow() {
    let width = this.searchWindow.width
    let height = this.searchWindow.height

    // Window size must be an odd number
    if (width % 2 !== 1) {
      width--
    }
    if (height % 2 !== 1) {
      height--
    }

    let xOffset = this.searchWindow.x
    let yOffset = this.searchWindow.y
    let xSearchRadius = Math.floor(width / 2)
    let ySearchRadius = Math.floor(height / 2)
    let x = xOffset + xSearchRadius
    let y = yOffset + ySearchRadius

    if (x < xSearchRadius) {
      width -= x - xSearchRadius
      xOffset += x - xSearchRadius
    }
    if (y < ySearchRadius) {
      height -= y - ySearchRadius
      yOffset += y - ySearchRadius
    }
    if (x + xSearchRadius > this.width - 1) {
      width -= (x + xSearchRadius) - (this.width - 1)
    }
    if (y + ySearchRadius > this.height - 1) {
      height -= (y + ySearchRadius) - (this.height - 1)
    }

    this.width = width
    this.height = height
    this.xOffset = xOffset
    this.yOffset = yOffset
  }

  initMap() {
    for (var i = 0; i < this.height; i++) {
      let row = []
      for (var j = 0; j < this.width; j++) {
        row.push(this.collides(j + this.xOffset, i + this.yOffset) ? 0 : Infinity)
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
    map[y - this.yOffset][x - this.xOffset] = length
    length++
    let min = Infinity
    let res = null
    if (x + 1 - this.xOffset < this.width && map[y - this.yOffset][x + 1 - this.xOffset] > length) {
      let r = this.buildRec({
        x: x + 1,
        y: y
      }, end, length, path.slice(0))
      if (r !== null && r[1] < min) {
        res = r
        min = r[1]
      }
    }
    if (x - 1 - this.xOffset >= 0 && map[y - this.yOffset][x - 1 - this.xOffset] > length) {
      let r = this.buildRec({
        x: x - 1,
        y: y
      }, end, length, path.slice(0))
      if (r !== null && r[1] < min) {
        res = r
        min = r[1]
      }
    }
    if (y + 1 - this.yOffset < this.height && map[y + 1 - this.yOffset][x - this.xOffset] > length) {
      let r = this.buildRec({
        x: x,
        y: y + 1
      }, end, length, path.slice(0))
      if (r !== null && r[1] < min) {
        res = r
        min = r[1]
      }
    }
    if (y - 1 - this.yOffset >= 0 && map[y - 1 - this.yOffset][x - this.xOffset] > length) {
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