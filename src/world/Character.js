import WorldObject from './WorldObject'
import IdleAI from './ai/IdleAI'

export default class Character extends WorldObject {
  constructor(config, aiFactory, tileWidth, tileHeight, world) {
    super(config, tileWidth, tileHeight)

    if (aiFactory) {
      this.ai = aiFactory.buildAI(world, this)
    } else {
      this.ai = new IdleAI(world, this)
    }

    this.lastAction = null
  }

  step(rng) {
    this.lastAction = this.ai.step(rng)
    return this.lastAction
  }

  move(direction) {
    this.x += direction.dx
    this.y += direction.dy
  }

  getDebugContext() {
    return this.ai.getDebugContext()
  }
}