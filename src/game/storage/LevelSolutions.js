import StorageWrapper from './StorageWrapper'
import Solution from './Solution'

export default class LevelSolutions extends StorageWrapper {
  constructor(key) {
    super(key)

    this.id = NaN
    this.solutions = []
    this.solutionID = NaN
    this.score = null
  }

  // Do not call directly this method. Call set() instead with the same arguments as this one
  init(id) {
    this.id = id
    this.solutions = []
    this.solutionID = NaN
    this.score = new LevelScore()
  }

  createDefaultSolution(name) {
    const id = StorageWrapper.getAvailableID(this.solutions)
    let solution = new Solution(`${this.storageKey}.solutions[${id}]`)
    solution.set(id, name)
    solution.save(false)
    this.solutions.push(solution)
    this.solutionID = id
    this.save(false)

    return solution
  }

  getCurrentSolution() {
    return this.getSolution(this.solutionID)
  }

  getSolution(id) {
    return this.solutions.find(s => s.get().id === id)
  }

  hasWon() {
    return this.score.hasWon()
  }

  load(data) {
    this.id = data.id
    this.solutions = super.loadIDArray(data.solutions, 'solutions', Solution)
    this.solutionID = data.solutionID
    this.score = LevelScore.buildFromJSON(data.score)
    return true
  }

  toJSON() {
    let o = super.toJSON()
    Object.assign(o, {
      id: this.id,
      solutions: super.toIDArray(this.solutions),
      solutionID: this.solutionID,
      score: this.score
    })

    return o
  }
}

class LevelScore {
  constructor(won = false, minStep = -1, minLength = -1) {
    this.won = won
    this.minStep = minStep
    this.minLength = minLength
  }

  static buildFromJSON(jsonObject) {
    return new LevelScore(jsonObject.won, jsonObject.minStep, jsonObject.minLength)
  }

  hasWon() {
    return this.won
  }
}