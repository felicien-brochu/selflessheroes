import StorageWrapper from './StorageWrapper'
import LevelSolutions from './LevelSolutions'

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

  createLevel(id) {
    let level = this.getLevel(id)
    if (level) {
      return level
    }

    level = new LevelSolutions(`${this.storageKey}.levels[${id}]`)
    level.set(id)
    level.createSolution()
    level.save(false)
    this.levels.push(level)
    this.save(false)

    return level
  }

  getLevel(id) {
    return this.levels.find(l => l.get().id === id)
  }

  load(data) {
    this.id = data.id
    this.name = data.name
    this.levels = super.loadIDArray(data.levels, 'levels', LevelSolutions)
    return true
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