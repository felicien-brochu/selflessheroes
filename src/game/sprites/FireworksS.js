import Phaser from 'phaser'

export default class FireworksS extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, config, delay = 0, tint = 0xffffff) {
    super(scene, x, y, config.animation)
    this.config = config
    this.delay = delay
    this.setTint(tint)
    this.init()

    // this.on('animationcomplete', () => {
    //   this.init()
    // })
  }

  init() {
    this.setVisible(false)
    this.follower = {
      t: 0,
      vec: new Phaser.Math.Vector2()
    }
    this.playing = false
  }

  playFireworks(path, rect) {
    // let size = (window.innerHeight / 3) / zoom
    // this.displayHeight = size
    // this.displayWidth = size
    let size = Math.min(rect.h, rect.w) / 3.5
    this.setScale(size / 100)
    // console.log("####SIZE", 1 / zoom)
    this.path = path

    let tween = this.scene.tweens.add({
      targets: this.follower,
      t: 1,
      ease: 'Expo.easeOut',
      duration: (this.config.frames - 0) / 60 * 1000,
      delay: this.delay
    })

    setTimeout(() => {
      this.play(this.config.animation)
      this.playing = true
      this.setVisible(true)
    }, this.delay)

    tween.setCallback('onComplete', () => {
      this.init()
    }, [])
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)
    if (this.playing) {
      // console.log("###update fw", this.follower.t, this.follower.vec.x, this.follower.vec.y)
      this.path.getPoint(this.follower.t, this.follower.vec)
      this.x = this.follower.vec.x
      this.y = this.follower.vec.y + 100
    }
  }
}