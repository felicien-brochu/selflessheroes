export default class TutorialConfig {
  constructor() {
    this.steps = []
  }

  addStep(step) {
    this.steps.push(step)
  }

  getStep(index) {
    return this.steps[index]
  }

  getLength() {
    return this.steps.length
  }
}

export class TutorialStep {
  constructor(anchor, textTemplate = 'no_text') {
    this.anchor = anchor
    this.textTemplate = textTemplate
  }
}

export class TutorialAnchor {
  constructor(selector, arrowPosition = 'top', arrowTargetX = 'center', arrowTargetY = 'center', arrowTargetOffsetX = 0, arrowTargetOffsetY = 0) {
    this.selector = selector
    this.arrowPosition = arrowPosition
    this.arrowTargetX = arrowTargetX
    this.arrowTargetY = arrowTargetY
    this.arrowTargetOffsetX = arrowTargetOffsetX
    this.arrowTargetOffsetY = arrowTargetOffsetY
  }

  getTargetNode() {
    return this.selector()
  }

  getTargetPosition() {
    let target = this.getTargetNode().getBoundingClientRect()
    let x, y

    switch (this.arrowTargetX) {
      case 'start':
        x = target.x
        break
      case 'center':
        x = target.x + target.width / 2
        break
      case 'end':
        x = target.x + target.width
        break
      default:
        x = 0
    }
    switch (this.arrowTargetY) {
      case 'start':
        y = target.y
        break
      case 'center':
        y = target.y + target.height / 2
        break
      case 'end':
        y = target.y + target.height
        break
      default:
        y = 0
    }

    x += this.arrowTargetOffsetX
    y += this.arrowTargetOffsetY

    return {
      x,
      y
    }
  }
}