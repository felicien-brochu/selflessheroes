import Tween from '../util/Tween'

export default class ScrollAnimator {
  constructor(scroll, lineHeight, line = 0, margin = 12, timeStretch = 10, updateInterval = 10) {
    this.scroll = scroll
    this.lineHeight = lineHeight
    this.line = line
    this.margin = margin
    this.timeStretch = timeStretch
    this.updateInterval = updateInterval

    this.tween = null
    this.update = this.update.bind(this)
  }

  showLine(line) {
    if (line !== this.line) {
      this.line = line

      let scrollHeight = this.scroll.getBoundingClientRect().height
      let scrollTop = this.scroll.scrollTop
      let top = this.line * this.lineHeight - scrollTop
      let bottom = (this.line + 1) * this.lineHeight - scrollTop - scrollHeight

      if (top < this.margin || bottom > -this.margin) {
        let from = this.scroll.scrollTop
        let to
        if (top < this.margin) {
          to = this.line * this.lineHeight - this.margin
        } else if (bottom > -this.margin) {
          to = (this.line + 1) * this.lineHeight - scrollHeight + this.margin
        }

        let duration = Math.sqrt(Math.abs(to - from)) * this.timeStretch
        if (this.tween) {
          this.tween.stop()
        }

        const maxScrollDuration = 200
        const minScrollDuration = 50
        duration = Math.min(duration, maxScrollDuration)
        duration = Math.max(duration, minScrollDuration)
        this.tween = new Tween(duration, this.update, from, to, this.updateInterval)
        this.tween.start()
      }
    }
  }

  update(scrollTop) {
    this.scroll.scrollTop = scrollTop
  }

}