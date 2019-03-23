class CharacterAction {
  constructor(type) {
    this.type = type
  }
}

export class MoveAction extends CharacterAction {
  constructor(x, y) {
    super('move')
    this.x = x
    this.y = y
  }
}