import AI from './AI'
import Direction from '../Direction'
import Spikes from '../objects/Spikes'
import StepAction from '../actions/StepAction'
import WaitAction from '../actions/WaitAction'

export default class FollowPathAI extends AI {
  constructor(world, character, config) {
    super(world, character)

    this.config = config
    this.paths = []
    this.pathIndex = 0
    this.pathPoint = 0
    this.forward = true
    this.lastStep = -1000

    if (typeof this.config.paths === 'string') {
      this.linkPathsConfigs()
    }
  }

  linkPathsConfigs() {
    let pathIDs = this.config.paths.split(',').map(id => parseInt(id))

    for (let id of pathIDs) {
      this.paths.push(this.world.findConfigObjectByID(id))
    }
  }

  step(rng) {
    let path = null
    let point = null
    let pathIndex = this.pathIndex
    let pathPoint = this.pathPoint
    let forward = this.forward

    if (pathIndex < this.paths.length) {
      path = this.paths[pathIndex]

      if (this.world.steps - this.lastStep < path.stepRythm) {
        return new WaitAction()
      }

      if (forward) {
        pathPoint++
        if (pathPoint >= path.path.length) {
          if (!path.yoyo) {
            pathIndex++
            pathPoint = 0
            if (pathIndex < this.paths.length) {
              path = this.paths[pathIndex]
            } else {
              path = null
            }
          } else {
            forward = false
            path = this.paths[pathIndex]
            pathPoint = path.path.length - 2
          }
        }
      } else {
        pathPoint--
        if (path.yoyo && pathPoint < 0) {
          forward = true
          pathPoint = 1
        }
      }

      if (path && pathPoint < path.path.length) {
        point = path.path[pathPoint]
        this.lastStep = this.world.steps

        let spikes = this.world.getWorldObjectsAt(point.x, point.y).filter(o => o instanceof Spikes)
        if (spikes.length > 0 && spikes[0].isEnabled()) {
          return new WaitAction()
        } else {
          this.pathIndex = pathIndex
          this.pathPoint = pathPoint
          this.forward = forward

          let dir = new Direction(point.x - this.character.x, point.y - this.character.y)
          return new StepAction(dir)
        }
      }
    }
    return new WaitAction()
  }
}