import lang from '../lang'
import Level from './Level'

import levelTest from './level0/level0'

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
import level102 from './level102/level102'
import level103 from './level103/level103'
import level104 from './level104/level104'
import level105 from './level105/level105'
import level106 from './level106/level106'
import level107 from './level107/level107'
import level108 from './level108/level108'
import level109 from './level109/level109'
import level110 from './level110/level110'
import level111 from './level111/level111'
import level112 from './level112/level112'
import level121 from './level121/level121'

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
  new Level(102, level102),
  new Level(103, level103),
  new Level(104, level104),
  new Level(105, level105),
  new Level(106, level106),
  new Level(107, level107),
  new Level(108, level108),
  new Level(109, level109),
  new Level(110, level110),
  new Level(111, level111),
  new Level(112, level112),
  new Level(121, level121),

  new Level(0, levelTest),
]

const categories = [{
    name: 'tutorial',
    color: 'blue',
    unlock: [],
    levels: [{
      id: 1,
      unlock: [],
    }, {
      id: 2,
      unlock: [1],
    }, {
      id: 3,
      unlock: [2],
    }, {
      id: 4,
      unlock: [3],
    }, {
      id: 5,
      unlock: [4],
    }, {
      id: 6,
      unlock: [5],
    }, {
      id: 7,
      unlock: [6],
    }, {
      id: 8,
      unlock: [7],
    }, {
      id: 9,
      unlock: [8],
    }, {
      id: 10,
      unlock: [9],
    }, {
      id: 11,
      unlock: [10],
      bonus: true,
    }, {
      id: 12,
      unlock: [11],
      bonus: true,
    }, ]
  },
  {
    name: 'eggs',
    color: 'green',
    unlock: [10],
    levels: [{
      id: 101,
      unlock: [],
    }, {
      id: 102,
      unlock: [101],
    }, {
      id: 103,
      unlock: [102],
    }, {
      id: 104,
      unlock: [103],
    }, {
      id: 105,
      unlock: [104],
      bonus: true,
    }, {
      id: 106,
      unlock: [104],
    }, {
      id: 107,
      unlock: [106],
    }, {
      id: 108,
      unlock: [107],
      bonus: true,
    }, {
      id: 109,
      unlock: [107],
    }, {
      id: 110,
      unlock: [109],
    }, {
      id: 111,
      unlock: [110],
    }, {
      id: 112,
      unlock: [111],
      bonus: true,
    }, {
      id: 121,
      unlock: [111],
    }]
  }
]

if (ENV === 'development') {
  categories.push({
    name: 'other',
    color: 'gray',
    unlock: [],
    levels: [{
      id: 0,
      unlock: [],
    }, ]
  })
}


class LevelManager {
  constructor(levels, categories) {
    this.levels = levels
    this.categories = categories

    this.installMessages()
  }

  installMessages() {
    for (let level of levels) {
      level.installMessages(lang)
    }
  }

  getList(levels) {
    return this.levels
  }

  getCareerList(career) {
    let winList = []
    for (let i = 0; i < this.levels.length; i++) {
      let solutions = career.getLevel(this.levels[i].id)
      winList.push({
        id: this.levels[i].id,
        won: !!(solutions && solutions.hasWon())
      })
    }

    let careerList = []
    for (let categoryConf of this.categories) {
      let category = {
        name: categoryConf.name,
        color: categoryConf.color,
        unlocked: this.isCategoryUnlocked(categoryConf, winList),
        levels: [],
      }

      for (let levelConf of categoryConf.levels) {
        let level = this.getLevelByID(levelConf.id)
        let score = null
        let levelSolutions = career.getLevel(levelConf.id)
        if (levelSolutions) {
          score = levelSolutions.score
        }
        let unlocked = this.isLevelUnlocked(level, winList)

        if (!(levelConf.bonus && !unlocked))
          category.levels.push({
            id: levelConf.id,
            level: level,
            bonus: !!levelConf.bonus,
            score: score,
            unlocked: unlocked,
          })
      }
      careerList.push(category)
    }

    return careerList
  }

  isCategoryUnlocked(category, winList) {
    return this.isUnlocked(category.unlock, winList)
  }

  isLevelUnlocked(level, winList) {
    let unlockTree
    for (let category of this.categories) {
      let levelConf = category.levels.find(lvl => lvl.id === level.id)
      if (levelConf) {
        unlockTree = levelConf.unlock
        break
      }
    }

    if (!unlockTree) {
      return false
    }

    return this.isUnlocked(unlockTree, winList)
  }

  isUnlocked(unlockTree, winList) {
    let condition = unlockTree.slice(0)
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
    return this.levels.find(level => level.id === id)
  }
}

const manager = new LevelManager(levels, categories)
export default manager