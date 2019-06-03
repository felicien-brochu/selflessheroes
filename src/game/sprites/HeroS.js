import Phaser from 'phaser'

import CharacterS from './CharacterS'

let assets = [
  'knight_red',
  'knight_pink',
  'knight_green',
  'knight_blue',
  'knight_purple',
  'knight_orange',
  'knight_dark_blue',
  'knight_white'
]


export default class HeroS extends CharacterS {
  constructor(scene, hero, tileWidth, tileHeight) {
    super(scene, hero, assets[hero.color], tileWidth, tileHeight, 0, -21)
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