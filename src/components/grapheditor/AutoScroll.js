export default class AutoScroll {
  constructor(scroll, callback = null, callbackSpeed = 2, zoneHeight = 55, minSpeed = 200, maxSpeed = 1000, updateInterval = 20) {
    this.scroll = scroll
    this.callback = callback
    this.callbackSpeed = callbackSpeed
    this.zoneHeight = zoneHeight
    this.minSpeed = minSpeed
    this.maxSpeed = maxSpeed
    this.updateInterval = updateInterval

    this.timerID = -1
    this.callbackTimerID = -1
    this.speed = 0

    this.moveScroll = this.moveScroll.bind(this)
  }

  update(e) {
    let scrollBounds = this.scroll.getBoundingClientRect()
    let topPosition = this.zoneHeight - (e.y - scrollBounds.top)
    let bottomPosition = this.zoneHeight - ((scrollBounds.top + scrollBounds.height) - e.y)

    if (topPosition >= 0) {
      this.speed = -(topPosition / this.zoneHeight) * (this.maxSpeed - this.minSpeed) - this.minSpeed
    } else if (bottomPosition >= 0) {
      this.speed = (bottomPosition / this.zoneHeight) * (this.maxSpeed - this.minSpeed) + this.minSpeed
    } else if (this.timerID >= 0) {
      this.stop()
    }

    if (this.timerID < 0 && (topPosition >= 0 || bottomPosition >= 0)) {
      this.timerID = setInterval(this.moveScroll, this.updateInterval)
      if (this.callback) {
        this.callbackTimerID = setInterval(this.callback, 1000 / this.callbackSpeed)
      }
    }
  }

  moveScroll() {
    this.scroll.scrollTop += this.speed * (this.updateInterval / 1000)
    // If scrolled to the end or begining, stop autoscroll
    if (this.speed < 0 && this.scroll.scrollTop === 0 ||
      this.speed > 0 && this.scroll.scrollHeight - this.scroll.scrollTop === this.scroll.clientHeight) {
      this.stop()
    }
  }

  stop() {
    if (this.timerID >= 0) {
      clearInterval(this.timerID)
      this.timerID = -1
      if (this.callbackTimerID >= 0) {
        clearInterval(this.callbackTimerID)
        this.callbackTimerID = -1
      }
      this.speed = 0
    }
  }
}