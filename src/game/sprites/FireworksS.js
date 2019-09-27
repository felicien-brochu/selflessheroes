import Phaser from 'phaser'

export default class FireworksS extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, config, delay = 0, tint = 0xffffff) {
    super(scene, x, y, config.animation)
    this.config = config
    this.delay = delay
    this.setTint(tint)
    this.timeoutID
    this.tween = null

    this.init()
  }

  init() {
    this.tween = null
    this.setVisible(false)
    this.follower = {
      t: 0,
      vec: new Phaser.Math.Vector2()
    }
    this.playing = false
  }

  stopFireworks() {
    clearTimeout(this.timeoutID)
    this.timeoutID = -1
    this.init()
  }

  playFireworks(path, rect) {
    let size = Math.min(rect.h, rect.w) / 3.5
    this.setScale(size / 100)
    this.path = path

    this.tween = this.scene.tweens.add({
      targets: this.follower,
      t: 1,
      ease: 'Expo.easeOut',
      duration: (this.config.frames - 0) / 60 * 1000,
      delay: this.delay
    })

    this.timeoutID = setTimeout(() => {
      this.play(this.config.animation)
      this.playing = true
      this.setVisible(true)
      this.timeoutID = -1
    }, this.delay)

    this.tween.on('complete', this.init, this)
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)
    if (this.playing) {
      this.path.getPoint(this.follower.t, this.follower.vec)
      this.x = this.follower.vec.x
      this.y = this.follower.vec.y + 100
    }
  }

  destroy(fromScene) {
    if (this.tween) {
      this.tween.off('complete')
    }
    super.destroy(fromScene)
  }
}