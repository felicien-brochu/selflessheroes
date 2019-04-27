import Level from '../world/Level'
import Level1 from './level1/Level1'

const levels = [
  new Level1(1),
  new Level(2, {}),
  new Level(3, {}),
  new Level(4, {})
]

class LevelManager {
  constructor(list) {
    this.list = list
  }

  getList(list) {
    return this.list
  }

  getLevelByID(id) {
    return this.list.find(level => level.id === id)
  }
}

export default new LevelManager(levels)