import PathFinder from './PathFinder'
import Direction from '../Direction'
import TerrainType from '../map/TerrainType'
import ObjectType from '../objects/ObjectType'

export default class WorldObjectFinder {
  constructor(target, character, world) {
    this.target = target
    this.character = character
    this.world = world
  }

  static hasArrivedAtObject(character, target) {
    return character.overlaps(target) || (
      character.distanceFrom(target) < 2 &&
      (
        target.type === ObjectType.cauldron ||
        target.type === ObjectType.bonfire ||
        target.type === ObjectType.npc ||
        target.type === ObjectType.hero
      )
    )
  }

  findDirection() {
    let direction = Direction.here
    let path = this.findPath()

    if (path.length === 0) {
      path = this.findPath(false)
    }
    if (path.length === 0) {
      path = this.findPath(false, false)
    }
    if (path.length === 0) {
      path = this.findPath(false, false, false)
    }
    if (path.length === 0) {
      path = this.findPath(false, false, false, false)
    }
    if (path.length === 0) {
      path = this.findPath(false, false, false, false, false)
    }

    if (path.length > 0) {
      direction = new Direction(path[1][0] - path[0][0], path[1][1] - path[0][1])
    }

    return direction
  }

  findPath(collidesHeroes = true, collidesNpc = true, collidesHole = true, collidesWall = true, collidesAnything = true) {
    const collides = (x, y) => {
      let terrainType = this.world.map.getTerrainTypeAt(x, y)
      let collidesTerrain = (collidesHole && terrainType === TerrainType.hole) || (collidesWall && terrainType === TerrainType.wall)
      let collidingObjects = this.world.getWorldObjectsAt(x, y).filter(o => {
        return o.getObjectType() === ObjectType.bonfire ||
          o.getObjectType() === ObjectType.cauldron ||
          (collidesNpc && o.getObjectType() === ObjectType.npc && o.ai.hasStepAvailable()) ||
          (collidesHeroes && o.getObjectType() === ObjectType.hero && o.ai.hasStepAvailable())
      })

      return collidesAnything && (collidesTerrain || collidingObjects.length > 0)
    }

    let pathFinder = new PathFinder(collides, this.world.map.width, this.world.map.height)
    let path = pathFinder.findPath({
      x: this.character.x,
      y: this.character.y,
    }, {
      x: this.target.x,
      y: this.target.y,
    })

    return path
  }
}