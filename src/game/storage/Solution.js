import StorageWrapper from './StorageWrapper'
import CodeHistory from './CodeHistory'

export default class Solution extends StorageWrapper {
  constructor(key) {
    super(key)

    this.id = NaN
    this.name = ''
    this.codeHistory = null
    this.score = null
  }

  // Do not call directly this method. Call set() instead with the same arguments as this one
  init(id, name) {
    this.id = id
    this.name = name
    if (!this.name) {
      this.name = `solution${id + 1}`
    }
    this.codeHistory = new CodeHistory()
    this.score = new SolutionScore()
  }

  load(data) {
    this.id = data.id
    this.name = data.name
    this.codeHistory = CodeHistory.buildFromJSON(data.codeHistory)
    this.score = SolutionScore.buildFromJSON(data.score)

    return true
  }

  toJSON() {
    let o = super.toJSON()
    Object.assign(o, {
      id: this.id,
      name: this.name,
      codeHistory: this.codeHistory,
      score: this.score
    })

    return o
  }
}

class SolutionScore {
  constructor() {}

  static buildFromJSON(o) {
    return new SolutionScore()
  }
}