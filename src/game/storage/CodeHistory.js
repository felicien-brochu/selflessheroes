const maxDepth = 200

export default class CodeHistory {
  constructor(firstRevision = '') {
    this.revisions = [firstRevision]
    this.activeRevision = 0
  }

  static buildFromJSON(jsonObject) {
    let codeHistory = new CodeHistory()

    codeHistory.revisions = jsonObject.revisions
    codeHistory.activeRevision = jsonObject.activeRevision

    return codeHistory
  }

  toJSON() {
    return {
      revisions: this.revisions,
      activeRevision: this.activeRevision
    }
  }

  push(code) {
    let changed = false
    if (code !== this.getCode()) {
      this.activeRevision++
      this.revisions.splice(this.activeRevision, this.revisions.length - this.activeRevision, code)

      this.removeTail()

      changed = true
    }
    return changed
  }

  insert(code) {
    let changed = false
    if (code !== this.getCode() && code !== this.getCode(1)) {
      this.activeRevision++
      this.revisions.splice(this.activeRevision, 0, code)

      this.removeTail()
      changed = true
    } else if (code === this.getCode(1)) {
      this.activeRevision++
      changed = true
    }

    return changed
  }

  removeTail() {
    if (this.revisions.length > maxDepth) {
      let newStart = this.revisions.length - maxDepth
      this.activeRevision -= newStart
      this.revisions = this.revisions.slice(newStart)
    }
  }

  undo() {
    if (this.activeRevision <= 0) {
      throw new Error('there is no more code history revision to undo')
    }

    this.activeRevision--

    return this.getCode()
  }

  canUndo() {
    return this.activeRevision > 0
  }

  redo() {
    if (this.activeRevision >= this.revisions.length - 1) {
      throw new Error('there is no code history revision to redo')
    }

    this.activeRevision++

    return this.getCode()
  }

  canRedo() {
    return this.activeRevision < this.revisions.length - 1
  }

  getCode(index = 0) {
    let revisionIndex = this.activeRevision + index
    if (revisionIndex < 0 || revisionIndex >= this.revisions.length) {
      return null
    }
    return this.revisions[revisionIndex]
  }

}