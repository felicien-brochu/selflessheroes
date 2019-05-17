const anims = {
  tiny_zombie_idle: {
    start: 0,
    end: 3
  },
  tiny_zombie_run: {
    start: 4,
    end: 7
  },
  goblin_idle: {
    start: 0,
    end: 3
  },
  goblin_run: {
    start: 4,
    end: 7
  },
  imp_idle: {
    start: 0,
    end: 3
  },
  imp_run: {
    start: 4,
    end: 7
  },
  skelet_idle: {
    start: 0,
    end: 3
  },
  skelet_run: {
    start: 4,
    end: 7
  },
  muddy_idle: {
    start: 0,
    end: 3
  },
  muddy_run: {
    start: 4,
    end: 7
  },
  swampy_idle: {
    start: 0,
    end: 3
  },
  swampy_run: {
    start: 4,
    end: 7
  },
  zombie_idle: {
    start: 0,
    end: 3
  },
  zombie_run: {
    start: 4,
    end: 7
  },
  ice_zombie_idle: {
    start: 0,
    end: 3
  },
  ice_zombie_run: {
    start: 4,
    end: 7
  },
  masked_orc_idle: {
    start: 0,
    end: 3
  },
  masked_orc_run: {
    start: 4,
    end: 7
  },
  orc_warrior_idle: {
    start: 0,
    end: 3
  },
  orc_warrior_run: {
    start: 4,
    end: 7
  },
  orc_shaman_idle: {
    start: 0,
    end: 3
  },
  orc_shaman_run: {
    start: 4,
    end: 7
  },
  necromancer_idle: {
    start: 0,
    end: 3
  },
  necromancer_run: {
    start: 4,
    end: 7
  },
  wogol_idle: {
    start: 0,
    end: 3
  },
  wogol_run: {
    start: 4,
    end: 7
  },
  chort_idle: {
    start: 0,
    end: 3
  },
  chort_run: {
    start: 4,
    end: 7
  },
  big_zombie_idle: {
    start: 0,
    end: 3
  },
  big_zombie_run: {
    start: 4,
    end: 7
  },
  ogre_idle: {
    start: 0,
    end: 3
  },
  ogre_run: {
    start: 4,
    end: 7
  },
  big_demon_idle: {
    start: 0,
    end: 3
  },
  big_demon_run: {
    start: 4,
    end: 7
  },
  elf_f_idle: {
    start: 0,
    end: 3
  },
  elf_f_run: {
    start: 4,
    end: 7
  },
  elf_f_hit: {
    start: 8,
    end: 8
  },
  elf_f_sleep: {
    start: 9,
    end: 9
  },
  elf_m_idle: {
    start: 0,
    end: 3
  },
  elf_m_run: {
    start: 4,
    end: 7
  },
  elf_m_hit: {
    start: 8,
    end: 8
  },
  elf_m_sleep: {
    start: 9,
    end: 9
  },
  knight_f_idle: {
    start: 0,
    end: 3
  },
  knight_f_run: {
    start: 4,
    end: 7
  },
  knight_f_hit: {
    start: 8,
    end: 8
  },
  knight_f_sleep: {
    start: 9,
    end: 9
  },
  knight_m_idle: {
    start: 0,
    end: 3
  },
  knight_m_run: {
    start: 4,
    end: 7
  },
  knight_m_hit: {
    start: 8,
    end: 8
  },
  knight_m_sleep: {
    start: 9,
    end: 9
  },
  wizzard_f_idle: {
    start: 0,
    end: 3
  },
  wizzard_f_run: {
    start: 4,
    end: 7
  },
  wizzard_f_hit: {
    start: 8,
    end: 8
  },
  wizzard_f_sleep: {
    start: 9,
    end: 9
  },
  wizzard_m_idle: {
    start: 0,
    end: 3
  },
  wizzard_m_run: {
    start: 4,
    end: 7
  },
  wizzard_m_hit: {
    start: 8,
    end: 8
  },
  wizzard_m_sleep: {
    start: 9,
    end: 9
  },
  bonfire_off: {
    sprite: 'bonfire',
    start: 0,
    end: 0
  },
  bonfire_on: {
    sprite: 'bonfire',
    start: 1,
    end: 8
  },
  explosion: {
    sprite: 'explosion',
    start: 0,
    end: 8,
    repeat: 0
  },
  ashes: {
    sprite: 'ashes',
    start: 0,
    end: 7,
    repeat: 0
  },
  sleep_zzz: {
    sprite: 'sleep_zzz',
    start: 0,
    end: 4,
    frameRate: 2
  },
  fireworks1: {
    sprite: 'fireworks1',
    start: 0,
    end: 70,
    frameRate: 60
  },
  fireworks2: {
    sprite: 'fireworks2',
    start: 0,
    end: 81,
    frameRate: 60
  },
  fireworks3: {
    sprite: 'fireworks3',
    start: 0,
    end: 73,
    frameRate: 60
  },
  fireworks4: {
    sprite: 'fireworks4',
    start: 0,
    end: 64,
    frameRate: 60
  },
  fireworks5: {
    sprite: 'fireworks5',
    start: 0,
    end: 63,
    frameRate: 60
  }
}

export default class AnimationBuilder {
  static build(scene) {
    for (var key in anims) {
      if (anims.hasOwnProperty(key)) {
        let spriteKey = key.replace(/(.*)_((idle)|(run)|(hit)|(sleep))/, '$1')
        let animConfig = anims[key]
        if (animConfig.sprite) {
          spriteKey = animConfig.sprite
        }
        let repeat = -1
        if (animConfig.repeat !== undefined) {
          repeat = animConfig.repeat
        }
        let frameRate = 12
        if (animConfig.frameRate !== undefined) {
          frameRate = animConfig.frameRate
        }

        scene.anims.create({
          key: key,
          frames: scene.anims.generateFrameNumbers(spriteKey, {
            start: animConfig.start,
            end: animConfig.end
          }),
          repeat: repeat,
          frameRate: frameRate
        })
      }
    }
  }
}