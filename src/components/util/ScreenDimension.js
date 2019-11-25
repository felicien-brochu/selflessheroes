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
    let width = (window.screen.width > 0) ? window.screen.width : window.innerWidth
    let height = (window.screen.height > 0) ? window.screen.height : window.innerHeight
    let maxDimension = Math.max(width, height)
    let minDimension = Math.min(width, height)

    return {
      max: maxDimension,
      min: minDimension
    }
  }
}