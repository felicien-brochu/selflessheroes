import WorldObject from './WorldObject'

export default class Character extends WorldObject {
  constructor(config, tileWidth, tileHeight) {
    super(config, tileWidth, tileHeight)

    this.lastAction = null
  }

  step() {
    throw new Error('Needs subclass implementation')
  }

  move(direction) {
    this.x += direction.dx
    this.y += direction.dy
  }
}