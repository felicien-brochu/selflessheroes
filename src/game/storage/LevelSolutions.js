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

  duplicateSolution(solutionID, suffix) {
    const template = this.getSolution(solutionID)
    const id = StorageWrapper.getAvailableID(this.solutions)
    let solution = new Solution(`${this.storageKey}.solutions[${id}]`)
    solution.set(id, `${template.name}${suffix}`, template.codeHistory.getCode(), template.editorType)
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

  importFromSaved(json) {
    this.id = json.id
    this.solutionID = json.solutionID
    this.score = LevelScore.buildFromJSON(json.score)

    for (let solutionConfig of json.solutions) {
      let solution = new Solution(`${this.storageKey}.solutions[${solutionConfig.id}]`)
      solution.importFromSaved(solutionConfig)
      this.solutions.push(solution)
    }

    this.loaded = true
    this.save(false)
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
  constructor(won = false, minStep = -1, minLength = -1, shownWon = false, shownMinStep = -1, shownMinLength = -1) {
    this.won = won
    this.minStep = minStep
    this.minLength = minLength
    this.shownWon = shownWon
    this.shownMinStep = shownMinStep
    this.shownMinLength = shownMinLength
  }

  static buildFromJSON(jsonObject) {
    return new LevelScore(jsonObject.won, jsonObject.minStep, jsonObject.minLength, jsonObject.shownWon, jsonObject.shownMinStep, jsonObject.shownMinLength)
  }

  hasWon() {
    return this.won
  }

  hasWonSpeedTarget(level) {
    return this.minStep >= 0 && this.minStep <= level.speedTarget
  }

  hasWonLengthTarget(level) {
    return this.minLength >= 0 && this.minLength <= level.lengthTarget
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

  hasToShowScore(level) {
    return this.hasToShowWon() || this.hasToShowWonSpeedTarget(level) || this.hasToShowWonLengthTarget(level)
  }

  hasToShowWon() {
    return !this.shownWon && this.won
  }

  hasToShowWonSpeedTarget(level) {
    return this.hasWonSpeedTarget(level) &&
      (this.shownMinStep < 0 || this.shownMinStep > level.speedTarget)
  }

  hasToShowWonLengthTarget(level) {
    return this.hasWonLengthTarget(level) &&
      (this.shownMinLength < 0 || this.shownMinLength > level.lengthTarget)
  }

  show() {
    this.showWon()
    this.showMinStep()
    this.showMinLength()
  }

  showWon() {
    this.shownWon = this.won
  }

  showMinStep() {
    this.shownMinStep = this.minStep
  }

  showMinLength() {
    this.shownMinLength = this.minLength
  }

  clone() {
    return new LevelScore(this.won, this.minStep, this.minLength, this.shownWon, this.shownMinStep, this.shownMinLength)
  }
}