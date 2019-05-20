const soundDefs = [{
    key: 'fireworks_sfx'
  },
  {
    key: 'tests_sfx',
    config: {
      loop: true,
      volume: 0.5
    }
  },
  {
    key: 'scream_sfx',
    config: {
      volume: 0.05
    }
  },
  {
    key: 'step_sfx',
    config: {
      volume: 1
    }
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
      volume: 0.1
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

  stop(key) {
    this.sounds.get(key).stop()
  }
}