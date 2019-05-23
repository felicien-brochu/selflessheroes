import Level from './Level'
import Level1 from './level1/Level1'
import Level2 from './level2/Level2'
import Level3 from './level3/Level3'
import Level4 from './level4/Level4'
import Level5 from './level5/Level5'
import Level6 from './level6/Level6'
import Level7 from './level7/Level7'
import Level8 from './level8/Level8'
import Level9 from './level9/Level9'
import Level10 from './level10/Level10'
import Level101 from './level101/Level101'
import Level102 from './level102/Level102'

const levels = [
  new Level1(1),
  new Level2(2),
  new Level3(3),
  new Level4(4),
  new Level5(5),
  new Level6(6),
  new Level7(7),
  new Level8(8),
  new Level9(9),
  new Level10(10),
  new Level101(101),
  new Level102(102)
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
  101: [10],
  102: [101]
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