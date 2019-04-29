import Level from '../world/Level'
import Level1 from './level1/Level1'

const levels = [
  new Level1(1),
  new Level(2, {}),
  new Level(3, {}),
  new Level(4, {})
]

const unlockTree = {
  1: [],
  2: [1],
  3: [1],
  // 4: [2, 'or', 3]
  4: []
}

class LevelManager {
  constructor(list, unlockTree) {
    this.list = list
    this.unlockTree = unlockTree
  }

  getList(list) {
    return this.list
  }

  getCareerList(career) {
    let winList = []
    for (let i = 0; i < this.list.length; i++) {
      let solutions = career.getLevel(this.list[i].id)
      winList.push({
        id: this.list[i].id,
        won: !!(solutions && solutions.hasWon())
      })
    }

    let careerList = []
    for (let i = 0; i < this.list.length; i++) {
      careerList.push({
        level: this.list[i],
        unlocked: this.isLevelUnlocked(this.list[i], winList)
      })
    }

    return careerList
  }

  isLevelUnlocked(level, winList) {
    let condition = this.unlockTree[level.id].slice(0)
    if (condition.length === 0) {
      return true
    }
    for (let i = 0; i < condition.length; i++) {
      if (typeof condition[i] === 'number') {
        condition[i] = winList.find(item => item.id === condition[i]).won
      }
    }

    for (let i = 0; i < condition.length; i++) {
      if (condition[i] === 'and') {
        condition.splice(i - 1, 3, condition[i - 1] && condition[i + 1])
      }
    }

    for (let i = 0; condition.length > 1; i++) {
      if (condition[i] === 'or') {
        condition.splice(i - 1, 3, condition[i - 1] || condition[i + 1])
      }
    }

    return condition[0]
  }

  getLevelByID(id) {
    return this.list.find(level => level.id === id)
  }
}

const manager = new LevelManager(levels, unlockTree)
export default manager