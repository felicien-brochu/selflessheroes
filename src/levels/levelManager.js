import Level from './Level'
import level1 from './level1/level1'
import level2 from './level2/level2'
import level3 from './level3/level3'
import level4 from './level4/level4'
import level5 from './level5/level5'
import level6 from './level6/level6'
import level7 from './level7/level7'
import level8 from './level8/level8'
import level9 from './level9/level9'
import level10 from './level10/level10'
import level11 from './level11/level11'
import level12 from './level12/level12'
import level101 from './level101/level101'
// import levelTest from './levelTest/levelTest'

const levels = [
  new Level(1, level1),
  new Level(2, level2),
  new Level(3, level3),
  new Level(4, level4),
  new Level(5, level5),
  new Level(6, level6),
  new Level(7, level7),
  new Level(8, level8),
  new Level(9, level9),
  new Level(10, level10),
  new Level(11, level11),
  new Level(12, level12),
  new Level(101, level101),
  // new Level(0, levelTest),
]

const unlockTree = {
  1: [],
  2: [1],
  3: [2],
  4: [3],
  5: [4],
  6: [5],
  7: [6],
  8: [7],
  9: [8],
  10: [9],
  11: [10],
  12: [11],
  101: [10],
  // 0: [],
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