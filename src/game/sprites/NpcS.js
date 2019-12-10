import Phaser from 'phaser'

import CharacterS from './CharacterS'


export default class NpcS extends CharacterS {
  constructor(scene, npc, tileWidth, tileHeight) {
    super(scene, npc, npc.race, tileWidth, tileHeight, 0, -21 + npc.yOffset)
  }

  getScreamAsset() {
    return 'npc_scream_sfx'
  }

  startCreateAnimation() {
    const fallHeight = 50
    let targetY = this.y
    this.y -= fallHeight
    this.alpha = 0

    this.scene.tweens.add({
      targets: this,
      y: targetY,
      alpha: 1,
      ease: 'Quad.easeOut',
      duration: 400
    })
  }
}