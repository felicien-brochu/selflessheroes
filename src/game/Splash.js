import Phaser from 'phaser'

export default class extends Phaser.Scene {
  constructor() {
    super({
      key: 'SplashScene'
    })
  }

  preload() {
    //
    // load your assets
    //
    this.load.spritesheet('elf_f', 'assets/images/elf_f.png', {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('elf_m', 'assets/images/elf_m.png', {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('knight_f', 'assets/images/knight_f.png', {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('knight_m', 'assets/images/knight_m.png', {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('wizzard_f', 'assets/images/wizzard_f.png', {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('wizzard_m', 'assets/images/wizzard_m.png', {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('tiny_zombie', 'assets/images/tiny_zombie.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.spritesheet('goblin', 'assets/images/goblin.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.spritesheet('imp', 'assets/images/imp.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.spritesheet('skelet', 'assets/images/skelet.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.spritesheet('muddy', 'assets/images/muddy.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.spritesheet('swampy', 'assets/images/swampy.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.spritesheet('zombie', 'assets/images/zombie.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.spritesheet('masked_orc', 'assets/images/masked_orc.png', {
      frameWidth: 32,
      frameHeight: 40
    })
    this.load.spritesheet('orc_warrior', 'assets/images/orc_warrior.png', {
      frameWidth: 32,
      frameHeight: 40
    })
    this.load.spritesheet('orc_shaman', 'assets/images/orc_shaman.png', {
      frameWidth: 32,
      frameHeight: 40
    })
    this.load.spritesheet('necromancer', 'assets/images/necromancer.png', {
      frameWidth: 32,
      frameHeight: 40
    })
    this.load.spritesheet('wogol', 'assets/images/wogol.png', {
      frameWidth: 32,
      frameHeight: 40
    })
    this.load.spritesheet('chort', 'assets/images/chort.png', {
      frameWidth: 32,
      frameHeight: 48
    })
    this.load.spritesheet('big_zombie', 'assets/images/big_zombie.png', {
      frameWidth: 64,
      frameHeight: 68
    })
    this.load.spritesheet('ogre', 'assets/images/ogre.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('big_demon', 'assets/images/big_demon.png', {
      frameWidth: 64,
      frameHeight: 72
    })
    this.load.spritesheet('button_blue', 'assets/images/button_blue.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.spritesheet('button_red', 'assets/images/button_red.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.spritesheet('lever', 'assets/images/lever.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.image('follow_cursor', 'assets/images/follow_cursor.png')
    this.load.image('tiles', 'assets/tilemaps/tiles/DungeonTileset.png')
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/map3.json')
    this.load.json('map_object', 'assets/tilemaps/maps/map3.json')
  }

  create() {
    this.scene.start('GameScene', this.game.gameSceneConfig)
  }

  update() {}
}