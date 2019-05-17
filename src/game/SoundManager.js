const soundDefs = [{
    key: 'fireworks_sfx'
  },
  {
    key: 'scream_sfx',
    config: {
      volume: 0.05
    }
  },
  {
    key: 'step_sfx'
  },
  {
    key: 'fireball_sfx',
    config: {
      volume: 0.5
    }
  },
  {
    key: 'bonfire_sfx',
    config: {
      volume: 0.5
    }
  },
]

export default class SoundManager {
  constructor(scene) {
    this.scene = scene
    this.sound = scene.sound
    this.sounds = new Map()
    this.initSounds()
  }

  initSounds() {
    for (let soundDef of soundDefs) {
      this.sounds.set(soundDef.key, this.sound.add(soundDef.key, soundDef.config))
    }
  }

  play(key, config) {
    this.sounds.get(key).play(config)
  }
}