import StorageWrapper from './StorageWrapper'
import LevelSolutions from './LevelSolutions'
import levelManager from '../../levels/levelManager'

export default class Career extends StorageWrapper {
  constructor(key) {
    super(key)

    this.id = NaN
    this.name = ''
    this.levels = []
  }

  // Do not call directly this method. Call set() instead with the same arguments as this one
  init(id, name) {
    this.id = id
    this.name = name
    if (!this.name) {
      this.name = `career${id}`
    }
    this.levels = []
  }

  createUnlockedLevelSolutions(levels) {
    for (let category of levels) {
      for (let level of category.levels) {
        if (level.unlocked && !this.getLevel(level.id)) {
          this.createLevel(level.level)
        }
      }
    }
  }

  createLevel(levelConfig) {
    let level = this.getLevel(levelConfig.id)
    if (level) {
      return level
    }

    const id = levelConfig.id
    level = new LevelSolutions(`${this.storageKey}.levels[${id}]`)
    level.set(id)
    level.createDefaultSolution(levelConfig)
    level.save(false)
    this.levels.push(level)
    this.save(false)

    return level
  }

  getLevel(id) {
    return this.levels.find(l => l.get().id === id)
  }

  getStarCount() {
    let stars = 0
    for (let level of this.levels) {
      level.get()
      let levelConfig = levelManager.getLevelByID(level.id)
      if (levelConfig) {
        stars += level.score.getStarCount(levelConfig)
      }
    }
    return stars
  }

  load(data) {
    this.id = data.id
    this.name = data.name
    this.levels = super.loadIDArray(data.levels, 'levels', LevelSolutions)
    return true
  }

  importFromSaved(json) {
    this.name = json.name

    for (let levelConfig of json.levels) {
      let level = new LevelSolutions(`${this.storageKey}.levels[${levelConfig.id}]`)
      level.importFromSaved(levelConfig)
      this.levels.push(level)
    }

    this.loaded = true
    this.save(false)
  }

  toJSON() {
    let o = super.toJSON()
    Object.assign(o, {
      id: this.id,
      name: this.name,
      levels: super.toIDArray(this.levels),
    })

    return o
  }
}