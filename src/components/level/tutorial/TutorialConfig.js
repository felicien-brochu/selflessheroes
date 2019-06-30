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
  constructor(
    selector,
    arrowPosition = {
      position: 'top',
      origin: 'center',
      offset: 0
    }, arrowTarget = {
      x: 'center',
      y: 'center'
    }, arrowTargetOffset = {
      x: 0,
      y: 0
    }) {
    this.selector = selector
    this.arrowPosition = arrowPosition
    this.arrowTarget = arrowTarget
    this.arrowTargetOffset = arrowTargetOffset
  }

  getTargetNode() {
    let node = null

    try {
      node = this.selector()
    } catch (e) {
      node = null
    }

    if (!node) {
      throw new Error("Tutorial target node not found")
    }
    return node
  }

  getTargetPosition() {
    let target
    let targetNode = this.getTargetNode()
    if (targetNode) {
      target = targetNode.getBoundingClientRect()
    } else {
      target = document.body.getBoundingClientRect()
    }

    let x, y

    switch (this.arrowTarget.x) {
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
    switch (this.arrowTarget.y) {
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

    x += this.arrowTargetOffset.x
    y += this.arrowTargetOffset.y

    return {
      x,
      y
    }
  }
}