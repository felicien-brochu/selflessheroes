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

    this.celebrationsToPlay = 0
    this.timeoutID = -1
  }

  preload() {}

  create() {
    this.fireworks = []

    for (let fireworksDef of fireworksDefs) {
      let firework = new FireworksS(this, 200, 200, fireworksDef.config, fireworksDef.delay, fireworksDef.tint)
      this.fireworks.push(firework)
      this.add.existing(firework)
    }
  }

  playCelebration(rect, count = 1) {
    this.celebrationsToPlay = count
    if (this.celebrationsToPlay > 0) {
      this.playOneCelebration(rect)
    }
  }

  playOneCelebration(rect) {
    this.sound.play('fireworks_sfx')
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
    this.celebrationsToPlay--
    this.timeoutID = -1
    if (this.celebrationsToPlay > 0) {
      this.timeoutID = setTimeout(() => this.playOneCelebration(rect), 1500)
    }
  }

  stopCelebration() {
    this.sound.stopAll()
    this.fireworks.forEach(sprite => sprite.stopFireworks())
    clearTimeout(this.timeoutID)
  }

  update() {}
}