import pathfinding from 'pathfinding'

export default class PathFinder {

  constructor(collides, width, height, searchWindow) {
    this.collides = collides
    this.xOffset = 0
    this.yOffset = 0
    this.width = width
    this.height = height
    this.grid = null
    this.searchWindow = searchWindow

    // AStarFinder
    // BestFirstFinder
    // BreadthFirstFinder
    // DijkstraFinder
    // BiAStarFinder
    // BiBestFirstFinder
    // BiBreadthFirstFinder
    // BiDijkstraFinder
    // IDAStarFinder
    // JumpPointFinder
    this.pathFinder = new pathfinding.BiAStarFinder({
      allowDiagonal: true,
      dontCrossCorners: false,
      diagonalMovement: pathfinding.DiagonalMovement.Always, // Always, Never, IfAtMostOneObstacle, OnlyWhenNoObstacles
      heuristic: pathfinding.Heuristic.euclidean, // manhattan, euclidean, octile, chebyshev
    })

    if (searchWindow) {
      this.initWindow()
    }

    this.initGrid()
  }

  initGrid() {
    let grid = []
    for (var i = 0; i < this.height; i++) {
      let row = []
      for (var j = 0; j < this.width; j++) {
        row.push(this.collides(j + this.xOffset, i + this.yOffset) ? 1 : 0)
      }
      grid.push(row)
    }
    this.grid = new pathfinding.Grid(grid)
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

  findPath(start, end) {
    const grid = this.grid.clone()
    grid.setWalkableAt(start.x - this.xOffset, start.y - this.yOffset, true)
    grid.setWalkableAt(end.x - this.xOffset, end.y - this.yOffset, true)
    let path = this.pathFinder.findPath(start.x - this.xOffset, start.y - this.yOffset, end.x - this.xOffset, end.y - this.yOffset, grid)
    return path.map(p => [p[0] + this.xOffset, p[1] + this.yOffset])
  }
}