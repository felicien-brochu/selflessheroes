import Phaser from 'phaser'

export default class HeroS extends Phaser.GameObjects.Sprite {
  constructor(scene, hero, tileWidth, tileHeight) {
    super(scene, (hero.x + 0.5) * tileWidth, (hero.y + 0.5) * tileHeight, 'elf_m')

    this.tileWidth = tileWidth
    this.tileHeight = tileHeight
    this.hero = hero
  }

  update() {
    this.x = (this.hero.x + 0.5) * this.tileWidth + 2
    this.y = (this.hero.y + 0.5) * this.tileHeight - 18
    this.depth = 0
  }
}