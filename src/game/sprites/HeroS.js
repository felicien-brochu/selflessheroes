import Phaser from 'phaser'

import CharacterS from './CharacterS'
import heroColors from '../../shared/heroColors'

export default class HeroS extends CharacterS {
  constructor(scene, hero, tileWidth, tileHeight) {
    super(scene, hero, `knight_${heroColors[hero.color]}`, tileWidth, tileHeight, 0, -19)
    this.setInteractive()
    this.input.hitArea.setTo(0, 14, 32, 40)
  }

  getScreamAsset() {
    return 'hero_scream_sfx'
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