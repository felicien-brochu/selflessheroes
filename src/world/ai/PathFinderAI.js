import AI from './AI'
import Character from '../Character'
import StepAction from '../actions/StepAction'
import WaitAction from '../actions/WaitAction'
import Direction from '../Direction'
import PathFinder from './PathFinder'
import TerrainType from '../map/TerrainType'

export default class PathFinderAI extends AI {
  constructor(world, character, x, y) {
    super(world, character)

    this.targetX = x
    this.targetY = y

    this.buildPath()
    this.pathIndex = 0
  }

  step(rng) {
    let action
    if (this.pathIndex < this.path.length - 1) {
      action = new StepAction(new Direction(this.path[this.pathIndex + 1][0] - this.character.x, this.path[this.pathIndex + 1][1] - this.character.y))
      this.pathIndex++
    } else {
      action = new WaitAction()
    }
    return action
  }

  buildPath() {
    const collides = (x, y) => {
      let terrainType = this.world.map.getTerrainTypeAt(x, y)
      let collidesTerrain = terrainType === TerrainType.wall || terrainType === TerrainType.hole
      let collidingObjects = this.world.getWorldObjectsAt(x, y).filter(o => o instanceof Bonfire || o instanceof Cauldron || (o instanceof Character && !o.dead))

      return collidesTerrain || collidingObjects.length > 0
    }

    let pathFinder = new PathFinder(collides, this.world.map.width, this.world.map.height)
    this.path = pathFinder.findPath({
      x: this.character.x,
      y: this.character.y
    }, {
      x: this.targetX,
      y: this.targetY
    })
  }

  isDone() {
    return this.pathIndex >= this.path.length - 1
  }
}