class CharacterAction {
  constructor(type) {
    this.type = type
  }
}

export class WaitAction extends CharacterAction {
  constructor() {
    super('wait')
  }
}

export class MoveAction extends CharacterAction {
  constructor(x, y) {
    super('move')
    this.x = x
    this.y = y
  }

  get x() {
    return this._x
  }

  set x(x) {
    if (this._y !== 0 && x !== 0) {
      this._y = 0
    }
    this._x = Math.sign(x)
  }

  get y() {
    return this._y
  }

  set y(y) {
    if (this._x !== 0 && y !== 0) {
      this._x = 0
    }
    this._y = Math.sign(y)
  }
}