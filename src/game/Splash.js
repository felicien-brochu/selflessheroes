import Phaser from 'phaser'

import elf_f from './images/elf_f.png'
import elf_m from './images/elf_m.png'
import knight_f from './images/knight_f.png'
import knight_m from './images/knight_m.png'
import wizzard_f from './images/wizzard_f.png'
import wizzard_m from './images/wizzard_m.png'

// import tiny_zombie from './images/tiny_zombie.png'
// import goblin from './images/goblin.png'
// import imp from './images/imp.png'
// import skelet from './images/skelet.png'
// import muddy from './images/muddy.png'
// import swampy from './images/swampy.png'
// import zombie from './images/zombie.png'
// import masked_orc from './images/masked_orc.png'
// import orc_warrior from './images/orc_warrior.png'
// import orc_shaman from './images/orc_shaman.png'
// import necromancer from './images/necromancer.png'
// import wogol from './images/wogol.png'
// import chort from './images/chort.png'
// import big_zombie from './images/big_zombie.png'
// import ogre from './images/ogre.png'
// import big_demon from './images/big_demon.png'

import button_blue from './images/button_blue.png'
import button_red from './images/button_red.png'
// import lever from './images/lever.png'

import follow_cursor from './images/follow_cursor.png'


export default class extends Phaser.Scene {
  constructor() {
    super({
      key: 'SplashScene'
    })
  }

  preload() {
    // load assets
    this.load.spritesheet('elf_f', elf_f, {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('elf_m', elf_m, {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('knight_f', knight_f, {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('knight_m', knight_m, {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('wizzard_f', wizzard_f, {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('wizzard_m', wizzard_m, {
      frameWidth: 32,
      frameHeight: 56
    })
    // this.load.spritesheet('tiny_zombie', tiny_zombie, {
    //   frameWidth: 32,
    //   frameHeight: 32
    // })
    // this.load.spritesheet('goblin', goblin, {
    //   frameWidth: 32,
    //   frameHeight: 32
    // })
    // this.load.spritesheet('imp', imp, {
    //   frameWidth: 32,
    //   frameHeight: 32
    // })
    // this.load.spritesheet('skelet', skelet, {
    //   frameWidth: 32,
    //   frameHeight: 32
    // })
    // this.load.spritesheet('muddy', muddy, {
    //   frameWidth: 32,
    //   frameHeight: 32
    // })
    // this.load.spritesheet('swampy', swampy, {
    //   frameWidth: 32,
    //   frameHeight: 32
    // })
    // this.load.spritesheet('zombie', zombie, {
    //   frameWidth: 32,
    //   frameHeight: 32
    // })
    // this.load.spritesheet('masked_orc', masked_orc, {
    //   frameWidth: 32,
    //   frameHeight: 40
    // })
    // this.load.spritesheet('orc_warrior', orc_warrior, {
    //   frameWidth: 32,
    //   frameHeight: 40
    // })
    // this.load.spritesheet('orc_shaman', orc_shaman, {
    //   frameWidth: 32,
    //   frameHeight: 40
    // })
    // this.load.spritesheet('necromancer', necromancer, {
    //   frameWidth: 32,
    //   frameHeight: 40
    // })
    // this.load.spritesheet('wogol', wogol, {
    //   frameWidth: 32,
    //   frameHeight: 40
    // })
    // this.load.spritesheet('chort', chort, {
    //   frameWidth: 32,
    //   frameHeight: 48
    // })
    // this.load.spritesheet('big_zombie', big_zombie, {
    //   frameWidth: 64,
    //   frameHeight: 68
    // })
    // this.load.spritesheet('ogre', ogre, {
    //   frameWidth: 64,
    //   frameHeight: 64
    // })
    // this.load.spritesheet('big_demon', big_demon, {
    //   frameWidth: 64,
    //   frameHeight: 72
    // })
    this.load.spritesheet('button_blue', button_blue, {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.spritesheet('button_red', button_red, {
      frameWidth: 32,
      frameHeight: 32
    })
    // this.load.spritesheet('lever', lever, {
    //   frameWidth: 32,
    //   frameHeight: 32
    // })
    this.load.image('follow_cursor', follow_cursor)

    const levelID = this.game.gameSceneConfig.levelID
    const levelPath = `levels/level${levelID}/`
    this.load.image('tileset_image', `${levelPath}tileset.png`)
    this.load.json('map', `${levelPath}level.json`)
  }

  create() {
    this.scene.start('GameScene', this.game.gameSceneConfig)
  }

  update() {}
}