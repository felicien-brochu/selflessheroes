import Phaser from 'phaser'

import knight_orange from './images/knight_orange.png'
import knight_pink from './images/knight_pink.png'
import knight_green from './images/knight_green.png'
import knight_blue from './images/knight_blue.png'
import knight_purple from './images/knight_purple.png'
import knight_yellow from './images/knight_yellow.png'
import knight_dark_blue from './images/knight_dark_blue.png'
import knight_turquoise from './images/knight_turquoise.png'
import knight_red from './images/knight_red.png'
import knight_fuchsia from './images/knight_fuchsia.png'
import knight_hollywood_green from './images/knight_hollywood_green.png'

// import elf_f from './images/elf_f.png'
// import elf_m from './images/elf_m.png'
// import wizzard_f from './images/wizzard_f.png'
// import wizzard_m from './images/wizzard_m.png'

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
import ogre from './images/ogre.png'
// import big_demon from './images/big_demon.png'

import switch_blue from './images/switch_blue.png'
import switch_red from './images/switch_red.png'
// import lever from './images/lever.png'
import bonfire from './images/bonfire.png'
import cauldron_back from './images/cauldron_back.png'
import cauldron_front from './images/cauldron_front.png'
import spikes from './images/spikes.png'
import egg from './images/egg.png'

import symbol_cross from './images/symbol_cross.png'
import symbol_arrow_n from './images/symbol_arrow_n.png'
import symbol_arrow_e from './images/symbol_arrow_e.png'
import symbol_arrow_s from './images/symbol_arrow_s.png'
import symbol_arrow_w from './images/symbol_arrow_w.png'

import explosion from './images/explosion.png'
import ashes from './images/ashes.png'
import sleep_zzz from './images/sleep_zzz.png'
import write_smoke from './images/write_smoke.png'
import follow_cursor from './images/follow_cursor.png'
import observation from './images/observation.png'
import direction_e from './images/direction_e.png'
import direction_s from './images/direction_s.png'
import direction_w from './images/direction_w.png'
import direction_n from './images/direction_n.png'
import direction_ne from './images/direction_ne.png'
import direction_se from './images/direction_se.png'
import direction_sw from './images/direction_sw.png'
import direction_nw from './images/direction_nw.png'

import fireworks1 from './images/fireworks1.png'
import fireworks2 from './images/fireworks2.png'

// AUDIO

import fireworks_sfx from './audio/fireworks.mp3'
import tests_sfx from './audio/tests.mp3'
import hero_scream_sfx from './audio/hero_scream.mp3'
import npc_scream_sfx from './audio/npc_scream.mp3'
import step_sfx from './audio/step.mp3'
import fireball_sfx from './audio/fireball.mp3'
import write_sfx from './audio/write.mp3'
import light_sfx from './audio/light.mp3'
import cauldron_drop_sfx from './audio/cauldron_drop.mp3'
import spikes_on_sfx from './audio/spikes_on.mp3'
import spikes_off_sfx from './audio/spikes_off.mp3'

// FONTS

import digits_font from './images/digits.fnt'
import digits_font_texture from './images/digits.png'


export default class extends Phaser.Scene {
  constructor() {
    super({
      key: 'SplashScene'
    })
  }

  preload() {
    this.disablePhaserFullscreenManagement()

    // load assets
    this.load.spritesheet('knight_orange', knight_orange, {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('knight_pink', knight_pink, {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('knight_green', knight_green, {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('knight_blue', knight_blue, {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('knight_purple', knight_purple, {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('knight_yellow', knight_yellow, {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('knight_dark_blue', knight_dark_blue, {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('knight_turquoise', knight_turquoise, {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('knight_red', knight_red, {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('knight_fuchsia', knight_fuchsia, {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('knight_hollywood_green', knight_hollywood_green, {
      frameWidth: 32,
      frameHeight: 56
    })
    // this.load.spritesheet('elf_f', elf_f, {
    //   frameWidth: 32,
    //   frameHeight: 56
    // })
    // this.load.spritesheet('elf_m', elf_m, {
    //   frameWidth: 32,
    //   frameHeight: 56
    // })
    // this.load.spritesheet('wizzard_f', wizzard_f, {
    //   frameWidth: 32,
    //   frameHeight: 56
    // })
    // this.load.spritesheet('wizzard_m', wizzard_m, {
    //   frameWidth: 32,
    //   frameHeight: 56
    // })
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
    this.load.spritesheet('ogre', ogre, {
      frameWidth: 64,
      frameHeight: 64
    })
    // this.load.spritesheet('big_demon', big_demon, {
    //   frameWidth: 64,
    //   frameHeight: 72
    // })
    this.load.spritesheet('switch_blue', switch_blue, {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.spritesheet('switch_red', switch_red, {
      frameWidth: 32,
      frameHeight: 32
    })
    // this.load.spritesheet('lever', lever, {
    //   frameWidth: 32,
    //   frameHeight: 32
    // })
    this.load.spritesheet('bonfire', bonfire, {
      frameWidth: 28,
      frameHeight: 74
    })
    this.load.spritesheet('cauldron_back', cauldron_back, {
      frameWidth: 32,
      frameHeight: 38
    })
    this.load.spritesheet('cauldron_front', cauldron_front, {
      frameWidth: 32,
      frameHeight: 38
    })
    this.load.spritesheet('spikes', spikes, {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.image('egg', egg)

    this.load.image('symbol_cross', symbol_cross)
    this.load.image('symbol_arrow_n', symbol_arrow_n)
    this.load.image('symbol_arrow_e', symbol_arrow_e)
    this.load.image('symbol_arrow_s', symbol_arrow_s)
    this.load.image('symbol_arrow_w', symbol_arrow_w)


    this.load.spritesheet('explosion', explosion, {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.spritesheet('ashes', ashes, {
      frameWidth: 56,
      frameHeight: 56
    })
    this.load.spritesheet('sleep_zzz', sleep_zzz, {
      frameWidth: 32,
      frameHeight: 56
    })
    this.load.spritesheet('write_smoke', write_smoke, {
      frameWidth: 48,
      frameHeight: 48
    })
    this.load.spritesheet('fireworks1', fireworks1, {
      frameWidth: 100,
      frameHeight: 100
    })
    this.load.spritesheet('fireworks2', fireworks2, {
      frameWidth: 100,
      frameHeight: 100
    })
    this.load.image('follow_cursor', follow_cursor)
    this.load.image('observation', observation)
    this.load.image('direction_e', direction_e)
    this.load.image('direction_s', direction_s)
    this.load.image('direction_w', direction_w)
    this.load.image('direction_n', direction_n)
    this.load.image('direction_ne', direction_ne)
    this.load.image('direction_se', direction_se)
    this.load.image('direction_sw', direction_sw)
    this.load.image('direction_nw', direction_nw)

    // AUDIO
    this.load.audio('fireworks_sfx', fireworks_sfx)
    this.load.audio('tests_sfx', tests_sfx)
    this.load.audio('hero_scream_sfx', hero_scream_sfx)
    this.load.audio('npc_scream_sfx', npc_scream_sfx)
    this.load.audio('step_sfx', step_sfx)
    this.load.audio('fireball_sfx', fireball_sfx)
    this.load.audio('write_sfx', write_sfx)
    this.load.audio('light_sfx', light_sfx)
    this.load.audio('cauldron_drop_sfx', cauldron_drop_sfx)
    this.load.audio('spikes_on_sfx', spikes_on_sfx)
    this.load.audio('spikes_off_sfx', spikes_off_sfx)

    //FONTS
    this.load.bitmapFont('digits_font', digits_font_texture, digits_font)

    // LEVEL SPECIFIC
    const level = this.game.gameSceneConfig.level
    this.load.json('map', level.mapPath)
    this.load.image('tileset_image', level.tilesetImagePath)
  }

  disablePhaserFullscreenManagement() {
    var vendors = ['webkit', 'moz', '']
    const listeners = this.scale.listeners

    vendors.forEach(prefix => {
      document.removeEventListener(prefix + 'fullscreenchange', listeners.fullScreenChange, false)
      document.removeEventListener(prefix + 'fullscreenerror', listeners.fullScreenError, false)
    })

    //  MS Specific
    document.removeEventListener('MSFullscreenChange', listeners.fullScreenChange, false)
    document.removeEventListener('MSFullscreenError', listeners.fullScreenError, false)
  }

  create() {
    this.scene.start('GameScene', this.game.gameSceneConfig)
  }

  update() {}
}