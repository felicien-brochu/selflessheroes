import Phaser from 'phaser'

import LightableS from './LightableS'

class CauldronFrontS extends LightableS {
  constructor(scene, cauldron, tileWidth, tileHeight, offsetX = 0, offsetY = -9) {
    super(scene, cauldron, tileWidth, tileHeight, offsetX, offsetY, 'cauldron_front', 'cauldron_front_on', 'cauldron_front_off')
    this.depthOffset = 1000
    this.updateDepth()
  }
}

export default class CauldronS {
  constructor(scene, cauldron, tileWidth, tileHeight, offsetX = 0, offsetY = -9) {
    let x = (cauldron.x + 0.5) * tileWidth + offsetX,
      y = (cauldron.y + 0.5) * tileHeight + offsetY

    this.scene = scene
    this.cauldron = cauldron
    this.lastCauldron = this.cauldron.shallowCopy()
    this.depthOffset = 0
    this.offsetX = offsetX
    this.offsetY = offsetY

    this.back = new Phaser.GameObjects.Sprite(scene, x, y, 'cauldron_back')
    this.front = new CauldronFrontS(scene, cauldron, tileWidth, tileHeight)
    this.itemContainer = new Phaser.GameObjects.Container(scene, 0, 0)


    this.scene.add.existing(this.back)
    this.scene.add.existing(this.itemContainer)
    this.scene.add.existing(this.front)

    this.itemContainer.depth = (y - this.offsetY) + this.depthOffset
    this.back.depth = (y - this.offsetY) + this.depthOffset
    this.front.depthOffset = 1
    this.front.updateDepth()
  }

  beforeStep(world) {
    this.front.beforeStep(world)

    if (this.cauldron.items.length > this.lastCauldron.items.length) {
      for (let i = this.lastCauldron.items.length; i < this.cauldron.items.length; i++) {
        let itemId = this.cauldron.items[i].id
        let item = this.scene.getItemSprite(itemId)
        this.itemContainer.add(item)
      }

      let oldDepth = this.itemContainer.depth
      this.itemContainer.depth += 100

      this.scene.tweens.add({
        targets: this.itemContainer,
        depth: oldDepth,
        ease: 'Quad.easeInOut',
        duration: 0,
        delay: this.scene.runner.stepInterval / 6,
      })
    }

    this.lastCauldron = this.cauldron.shallowCopy()
  }

  afterStep(world) {
    this.front.afterStep(world)
  }

  update() {}

  destroy() {
    this.front.destroy()
    this.back.destroy()
  }
}