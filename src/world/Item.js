import WorldObject from './WorldObject'
import ObjectType from './ObjectType'

export default class Item extends WorldObject {
  constructor(config, tileWidth, tileHeight) {
    super(config, tileWidth, tileHeight)
    this.owner = null
  }

  setOwner(owner) {
    this.owner = owner
    if (this.owner) {
      this.x = owner.x
      this.y = owner.y
    }
  }

  shallowCopy() {
    let copy = super.shallowCopy()
    let owner = this.owner ? owner.shallowCopy() : null
    return Object.assign(copy, {
      owner
    })
  }
}