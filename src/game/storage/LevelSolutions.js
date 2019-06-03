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

  createDefaultSolution(levelConfig) {
    const id = StorageWrapper.getAvailableID(this.solutions)
    let solution = new Solution(`${this.storageKey}.solutions[${id}]`)
    solution.set(id, `solution${this.solutions.length + 1}`, levelConfig.startingCode, levelConfig.startingEditorType)
    solution.save(false)
    this.solutions.push(solution)
    this.solutionID = id
    this.save(false)

    return solution
  }

  duplicateSolution(solutionID) {
    const template = this.getSolution(solutionID)
    const id = StorageWrapper.getAvailableID(this.solutions)
    let solution = new Solution(`${this.storageKey}.solutions[${id}]`)
    solution.set(id, `${template.name} copy`, template.codeHistory.getCode(), template.editorType)
    solution.save(false)
    this.solutions.push(solution)
    this.solutionID = id
    this.save(false)

    return solution
  }

  deleteSolution(solutionID) {
    let solution = this.getSolution(solutionID)
    solution.clear()
    this.solutions.splice(this.solutions.indexOf(solution), 1)
    if (solutionID === this.solutionID) {
      if (this.solutions.length === 0) {
        this.solutionID = NaN
      } else {
        this.solutionID = this.solutions[0].get().id
      }
    }
    this.save()
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

  addScore(averageStep, codeLength) {
    this.score.add(averageStep, codeLength)
    this.save(false)
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

  getStarCount(level) {
    let stars = 0
    if (this.won) {
      stars++
      if (this.minStep <= level.speedTarget) {
        stars++
      }
      if (this.minLength <= level.lengthTarget) {
        stars++
      }
    }

    return stars
  }

  add(averageStep, codeLength) {
    this.won = true
    if (this.minStep < 0 || this.minStep > averageStep) {
      this.minStep = averageStep
    }
    if (this.minLength < 0 || this.minLength > codeLength) {
      this.minLength = codeLength
    }
  }
}