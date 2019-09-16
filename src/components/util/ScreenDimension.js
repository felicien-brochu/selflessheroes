const minDimension = {
  min: 480,
  max: 800,
}

export default class ScreenDimension {
  static isTooSmall() {
    let screenDimension = ScreenDimension.get()
    return screenDimension.max < minDimension.max || screenDimension.min < minDimension.min
  }

  static getMinDimension() {
    return Object.assign({}, minDimension)
  }

  static get() {
    let width = (window.innerWidth > 0) ? window.innerWidth : window.screen.width
    let height = (window.innerHeight > 0) ? window.innerHeight : window.screen.height
    let maxDimension = Math.max(width, height)
    let minDimension = Math.min(width, height)

    return {
      max: maxDimension,
      min: minDimension
    }
  }
}