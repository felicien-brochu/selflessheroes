export default class Tween {
  constructor(duration, callback, from, to, updateInterval) {
    this.duration = duration
    this.callback = callback
    this.from = from
    this.to = to
    this.current = 0
    this.updateInterval = updateInterval

    this.timerID = -1
    this.update = this.update.bind(this)
  }

  start() {
    if (this.timerID >= 0) {
      this.stop()
    }
    this.update()
    this.timerID = setInterval(this.update, this.updateInterval)
  }

  stop() {
    if (this.timerID >= 0) {
      clearInterval(this.timerID)
      this.timerID = -1
      this.current = 0
    }
  }

  update() {
    let value
    let v = this.current
    if ((v *= 2) < 1) {
      value = 0.5 * v * v;
    } else {
      value = -0.5 * (--v * (v - 2) - 1);
    }

    value = (this.to - this.from) * value + this.from
    this.callback(value)

    if (this.current >= 1) {
      this.stop()
    } else {
      this.current += this.updateInterval / this.duration
      if (this.current > 1) {
        this.current = 1
      }
    }
  }
}