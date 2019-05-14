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
    this.dead = false
    this.deathReason = null
  }

  step(rng) {
    let action = null
    if (!this.dead) {
      action = this.ai.step(rng)
    }
    this.lastAction = action
    return this.lastAction
  }

  move(direction) {
    this.x += direction.dx
    this.y += direction.dy
  }

  setDead(isDead, deathReason) {
    this.dead = isDead
    this.deathReason = deathReason
  }

  getDebugContext() {
    return this.ai.getDebugContext()
  }
}