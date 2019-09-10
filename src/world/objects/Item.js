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
    let ownerID = this.owner ? this.owner.id : null
    return Object.assign(copy, {
      ownerID
    })
  }
}