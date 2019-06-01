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

    this.initialDirection = 'e'

    this.lastAction = null
    this.dead = false
    this.deathReason = null
    this.item = null

    this.parseProperties()
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

    if (this.item) {
      this.item.x = this.x
      this.item.y = this.y
    }
  }

  dropItem(direction) {
    if (this.item) {
      this.item.setOwner(null)
      this.item.x = this.x + direction.dx
      this.item.y = this.y + direction.dy
      this.item = null
    }
  }

  takeItem(item) {
    if (item) {
      this.item = item
      item.setOwner(this)
    } else {
      this.item = null
    }
  }

  setDead(isDead, deathReason) {
    this.dead = isDead
    this.deathReason = deathReason
    if (isDead) {
      this.events.emit('die', this)
    }
  }

  getDebugContext() {
    return this.ai.getDebugContext()
  }

  shallowCopy() {
    let copy = super.shallowCopy()
    let item = this.item ? this.item.shallowCopy() : null
    return Object.assign(copy, {
      dead: this.dead,
      deathReason: this.deathReason,
      item: item
    })
  }
}