import Phaser from 'phaser'
import FireworksS from './sprites/FireworksS'


const fireworksConfs = [{
  animation: 'fireworks1',
  frames: 71
}, {
  animation: 'fireworks2',
  frames: 74
}]

const fireworksDefs = [{
    config: fireworksConfs[0],
    delay: 0,
    tint: 0xccffff
  },
  {
    config: fireworksConfs[1],
    delay: 150,
    tint: 0xffffff
  },
  {
    config: fireworksConfs[0],
    delay: 50,
    tint: 0xffaaaa
  },
  {
    config: fireworksConfs[1],
    delay: 0,
    tint: 0xffaaff
  },
  {
    config: fireworksConfs[0],
    delay: 200,
    tint: 0xffbbbb
  },
  {
    config: fireworksConfs[1],
    delay: 100,
    tint: 0xffffff
  },
  {
    config: fireworksConfs[0],
    delay: 0,
    tint: 0xffffff
  },
  {
    config: fireworksConfs[0],
    delay: 50,
    tint: 0xffeeee
  },
  {
    config: fireworksConfs[1],
    delay: 200,
    tint: 0xffbbbb
  },
  {
    config: fireworksConfs[0],
    delay: 150,
    tint: 0xffaa88
  },
  {
    config: fireworksConfs[1],
    delay: 0,
    tint: 0xffffff
  },
  {
    config: fireworksConfs[1],
    delay: 100,
    tint: 0xccffff
  },
  {
    config: fireworksConfs[0],
    delay: 100,
    tint: 0xffbbbb
  },
]


export default class extends Phaser.Scene {
  constructor() {
    super({
      key: 'CelebrationScene'
    })
  }

  preload() {}

  create() {
    this.fireworks = []

    for (let fireworksDef of fireworksDefs) {
      let firework = new FireworksS(this, 200, 200, fireworksDef.config, fireworksDef.delay, fireworksDef.tint)
      this.fireworks.push(firework)
      this.add.existing(firework)
    }

    this.fireworksSfx = this.sound.add('fireworks_sfx')
  }

  playCelebration(rect) {
    this.playOneCelebration(rect)
    setTimeout(() => this.playOneCelebration(rect), 1500)
    setTimeout(() => this.playOneCelebration(rect), 3000)
  }

  playOneCelebration(rect) {
    this.fireworksSfx.play({
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    })
    let rb = (min, max) => Math.random() * (max - min) + min
    let interval = (min, max, count, index) => min + ((max - min) / count - 1) * index

    let launchWidth = Math.min(rect.w, rect.h) / 1

    for (let i = 0; i < this.fireworks.length; i++) {
      let x = interval(rect.x + (rect.w - launchWidth) / 2, rect.x + (rect.w + launchWidth) / 2, this.fireworks.length, i)
      let y = rect.y + rect.h
      let path = new Phaser.Curves.Path(x, y)

      let dx = rb(-launchWidth / 5, launchWidth / 5)
      let dy = rb(-rect.h * 0.4, -rect.h * 1.05)

      path.cubicBezierTo(x + dx, y + dy, x, y + dy, x + dx, y + dy)
      this.fireworks[i].playFireworks(path, rect)
    }
  }

  update() {}
}